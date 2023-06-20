import { AxiosResponse } from "axios"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale, // x
    LinearScale, // y
    PointElement
} from 'chart.js'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

interface props {
    graphData: any[] | [],
    dataType: string
}



const SSLineChart: React.FC<props> = ({ graphData, dataType}) => {
    const [games, setGames] = useState<number>();
    const [stats, setStats] = useState<{player: string, stats: number[]}[]>();
    
    console.log(graphData)

    useEffect(() => {
        if (graphData) {
            const playerStats: { player: string; stats: number[]}[] = []
            const playerSet = new Set<string>()

            graphData.forEach((item : any, index: number) => {
                const playerName = `${item.player.first_name} ${item.player.last_name}`;

                if (!playerSet.has(playerName)) {
                    playerSet.add(playerName)
                    playerStats.push({ player: playerName , stats: [] })
                }
                
                const playerIndex = playerStats.findIndex(
                    (player) => player.player === playerName
                )

                if (playerIndex !== -1) {
                    const playerData = playerStats[playerIndex]
                    if (dataType === "Single Season Points") {

                        playerData.stats.push(graphData[index].pts)
                    }
                    else if (dataType === "Single Season Rebounds") {
                        playerData.stats.push(graphData[index].reb)
                    }
                    else if (dataType === "Single Season Assists") {
                        playerData.stats.push(graphData[index].ast)
                    }
                }
            })
            console.log(playerStats)
            setStats(playerStats)

            if (playerStats.length > 0) {
                const games_in_season = graphData.length / playerSet.size    
                setGames(games_in_season)     
            }
        }      
    }, [graphData, dataType])

    const colors = ["aqua", "red", "green", "blue", "yellow"];

    const data = {
        labels: Array.from({ length: games ? games + 1 : 0  }, (_, index) => index + 1),
                datasets: stats 
                ? stats.map((playerData, index) => ({
                    label:"hi",
                    data:playerData.stats,
                    backgroundColor: 'white',
                    borderColor: colors[index % colors.length],
                    pointBorderColor: 'white',
                    labelColor: colors[index % colors.length], 
                    fill: true
                })) :[]

                
        }

      console.log(stats)
        
      const options = {
        plugins: {
            legend: {
                labels: { 
                    color: 'white',

                }      
            }
        }
      }


      return (
        <div className="Graph">
            <h1>Graph</h1>
            <Line data={data} options={options}></Line>

            <div className="ColorCode">
                {stats?.map((playerData, index) => (
                <div
                    key={playerData.player}
                    style={{
                    backgroundColor: colors[index % colors.length],
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    padding: '10px',
                    marginBottom: '10px',
                    width: '30%'
                    }}
                >
                    <h3 className="mb-3 text-1xl font-semibold text-black-200">
                    {playerData.player}
                    </h3>
                </div>
                ))}
      </div>
        </div>
      )
    
   

     }
    

export default SSLineChart