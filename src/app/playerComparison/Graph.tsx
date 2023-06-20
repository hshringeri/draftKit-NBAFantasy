import React, { useState, useEffect } from 'react';
import Player from '../data';
import axios, { AxiosResponse } from 'axios';
import SSLineChart from './SSLineChart'
interface GraphProps {
  dataType: string;
  addedData: Player[];
}

const Graph: React.FC<GraphProps> = ({ dataType, addedData }) => {
  const [seasons, setSeasons] = useState<{player: Player; season: string}[]>([]);
  const [rangeOfSeasons, setRangeOfSeasons] = useState<{player: Player; seasons: string[]}[]>([]);
  const [playerIds, setPlayerIds] = useState<number[]>([]);
  const [graphData, setGraphData] = useState<any[]>();

  useEffect(() => {
    fetchPlayerIds();
  }, [addedData]);

  const fetchPlayerIds = async () => {
    const ids: number[] = [];

    for (const player of addedData) {
      try {
        const response = await axios.get(
          `https://www.balldontlie.io/api/v1/players?search=${player.first_name} ${player.last_name}`
        );

        if (response.data.data.length > 0) {
          ids.push(response.data.data[0].id);
          console.log(ids)
        }
      } catch (error) {
        console.log(error);
      }
    }
    setPlayerIds(ids);
  };

  useEffect(() => {
    if (addedData.length > 0) {
      setSeasons((prevSeasons) =>
        addedData.map((player, index) => ({
          player,
          season: prevSeasons[index]?.season || '',
        }))
      );
    }
  }, [addedData]);

  useEffect(() => {
    if (addedData.length > 0) {
      setRangeOfSeasons((prevSeasons) =>
        addedData.map((player, index) => ({
          player,
          seasons: prevSeasons[index]?.seasons || [],
        }))
      );
    }
  }, [addedData]);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedSeasons = [...seasons]
    updatedSeasons[index].season = event.target.value
    console.log(updatedSeasons)
    setSeasons(updatedSeasons);
    
  };

  const handleSeasonRange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedSeasons = [...rangeOfSeasons]
    updatedSeasons[index].seasons = event.target.value.split(",")
    console.log(updatedSeasons)
    setRangeOfSeasons(updatedSeasons)

  }

  let currentPage = 1
  const allData: any[] = []
  
  const fetchPlayerStats = async () => {
    try {
      console.log(seasons)
      const response = await axios.get(`https://www.balldontlie.io/api/v1/stats?seasons[]=${seasons.map((item) => item.season).join('&seasons[]=')}&player_ids[]=${playerIds.join(
        '&player_ids[]=')}&page=${currentPage}`
        
      );
      const result = response.data
      result.data.forEach((item:any) => {
        allData.push(item)
      })
      // Handle the fetched player stats here
      
      const nextPage = result.meta.next_page;

      if (nextPage) {
        currentPage = nextPage
        await fetchPlayerStats()
      }

      setGraphData(allData)
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const fetchRangeOfSeasonsPlayerStats = async () => {
    try {
      console.log(rangeOfSeasons)
      const seasonSet = new Set<string>();
      rangeOfSeasons.forEach((item) => {
        item.seasons.forEach((season) => {
            seasonSet.add(season);
        });
       });
       const seasons = Array.from(seasonSet);
       console.log(seasons);

       const seasonsQueryParam = seasons.map((season) => `seasons[]=${season}`).join('&');
       const playerIdsQueryParam = playerIds.map((id) => `player_ids[]=${id}`).join('&');
       
       seasons.forEach(async (season) => {
        const response = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&${playerIdsQueryParam}`);
        
        const result = response.data
        console.log(response.data)
        result.data.forEach((item:any) => {
            allData.push(item)
        })

       })
        
      

      setGraphData(allData)
      console.log(graphData)
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };



  return (
    <div className="card">
      <h3>Graph</h3>
      {dataType === 'Single Season Points' || dataType === 'Single Season Assists' || dataType === 'Single Season Rebounds' ? (
        <>
          <p>Stat: {dataType}</p>
         
          {seasons.map((item, index) => (
            
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                color: 'black',
                fontWeight: 'bold',
                borderRadius: '20px',
                padding: '10px',
                marginBottom: '10px',
                width: '50%',
              }}
            >
              <p>{item.player.first_name} {item.player.last_name}</p>
              <input
                type="text"
                className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-full focus:outline-none focus:ring-[1px] focus:ring-green-700 placeholder:text-zinc-400"
                placeholder="Choose Year"
                value={item.season}
                onChange={(event) => handleSeasonChange(event, index)}
              />
            </div>
          ))}
          
          <button onClick={fetchPlayerStats}>Fetch Single Season Player Stats</button> <br/>
          <SSLineChart graphData={graphData ? graphData : []} dataType={dataType}></SSLineChart>

        </>
        
      ) : null}

{dataType === 'Range of Seasons Points' || dataType === 'Range of Seasons Assists' || dataType === 'Range of Seasons Rebounds' ? (
        <>
          <p>Stat: {dataType}</p>
         
          {rangeOfSeasons.map((item, index) => (
            
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                color: 'black',
                fontWeight: 'bold',
                borderRadius: '20px',
                padding: '10px',
                marginBottom: '10px',
                width: '50%',
              }}
            >
              <p>{item.player.first_name} {item.player.last_name}</p>
              <input
                type="text"
                className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-full focus:outline-none focus:ring-[1px] focus:ring-green-700 placeholder:text-zinc-400"
                placeholder="Choose Years"
                value={item.seasons}
                onChange={(event) => handleSeasonRange(event, index)}
              />
            </div>
          ))}
          
          <button onClick={fetchRangeOfSeasonsPlayerStats}>Fetch Range of Seasons Player Stats</button> <br/>
          <SSLineChart graphData={graphData ? graphData : []} dataType={dataType}></SSLineChart>

        </>
        
      ) : null}

    </div>
  );
};

export default Graph;
