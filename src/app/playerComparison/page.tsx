'use client'
import { FC, SetStateAction, useState, useEffect } from 'react'
import "../globals.css"
import img1 from '../images/nbapixel.jpg'
import Image from 'next/image';
import axios from 'axios';
import Player from '../data'
import { useRouter } from 'next/navigation'
import Graph from './Graph';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchedData, setSearchedData] = useState<Player[]>([]);
    const [addedData, setAddedData] = useState<Player[]>([]);
    const [dataType, setDataType] = useState('');


    useEffect(() => {
      // Fetch data from the API when the search value changes
      if (searchValue) {
        fetchData();
      }
    }, [searchValue]);
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.balldontlie.io/api/v1/players?search=${searchValue}`
        );
  
        // Handle the fetched data here
        console.log(response.data);
        setSearchedData(response.data.data);
      } catch (error) {
        // Handle error
        console.log(error);
      }
    };
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    };

    const handleAddData = (player: Player) => {
        setAddedData((prevData) => [...prevData, player]);
        console.log(addedData)
    };

    const handleDataType = (type: SetStateAction<string>) => {
        setDataType(type)
    }
    return (
        <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="bg-zinc-900 text-zinc-200">
        <title className={`mb-3 text-6xl font-semibold text-blue-200`}>Compare Players</title>
        <div className="flex flex-col gap-10 items-center p-6">
        <h1 className={`mb-3 text-6xl font-semibold text-blue-200`}>Compare Players</h1>
        <div className="flex gap-2">
            <input
                type="text"
                className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-full focus:outline-none focus:ring-[1px] focus:ring-green-700 placeholder:text-zinc-400"
                placeholder="NBA Player"
                value={searchValue}
                onChange={handleSearchChange}

            />
            <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => handleAddData(searchedData[0])}
            >
            Add
            </button>
        </div>
        <Image src={img1} alt="" style={{ width: '700px', height: '500px', borderRadius: '50%', border: '4px solid #ff00ff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }} />
        </div >
            <ul className="flex gap-2">
              {addedData.map((player) => (
                  <div key={player.id} 
                    style={{
                        backgroundColor: 'rgba(128, 128, 128, 0.5)',
                        color: 'black',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px',
                        marginBottom: '10px',
                        width: '30%'
                    }}>
                        <h3 className={`mb-3 text-1xl font-semibold text-blue-200`}>Name: {player.first_name} {player.last_name}</h3>
                        <p className={`mb-3 text-1xl font-semibold text-blue-200`}>Position: {player.position}</p>
                        <p className={`mb-3 text-1xl font-semibold text-blue-200`}>Height: {player.height_feet} ft {player.height_inches} in</p>
                        <p className={`mb-3 text-1xl font-semibold text-blue-200`}>Weight: {player.weight_pounds} lbs</p>
                        <p className={`mb-3 text-1xl font-semibold text-blue-200`}>Team: {player.team.full_name}</p>
                  </div>
              ))}
            </ul>

            <div
                style={{
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
            <h1 className={`mb-3 text-3xl font-semibold text-blue-200`}>Compare Stats</h1>
            </div>
            <div className="flex gap-2">
                <div style={{fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', fontSize: '24px'}}>Single Season</div> 
                    <button 
                        style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', backgroundColor: 'maroon', color: 'black', borderRadius: '10px', padding: '5px 10px', margin: '5px' }}
                        onClick={() => setDataType('Single Season Points')}
                        >
                        Points
                    </button> <br/> <br/>
                    <button 
                        style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', backgroundColor: 'maroon', color: 'black', borderRadius: '10px', padding: '5px 10px', margin: '5px' }}
                        onClick={() => setDataType('Single Season Assists')}>
                            Assists
                    </button> <br/> <br/>
                    <button 
                        style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', backgroundColor: 'maroon', color: 'black', borderRadius: '10px', padding: '5px 10px', margin: '5px' }}
                        onClick={() => setDataType('Single Season Rebounds')}>
                            Rebounds
                    </button> 
       
                <div style={{fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', fontSize: '24px'}}>Range of Seasons</div> <br/>
                    <button 
                        style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', backgroundColor: 'maroon', color: 'black', borderRadius: '10px', padding: '5px 10px', margin: '5px' }}
                        onClick={() => setDataType('Range of Seasons Points')}
                        >
                        Points
                    </button> <br/> <br/>
                    <button 
                        style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', backgroundColor: 'maroon', color: 'black', borderRadius: '10px', padding: '5px 10px', margin: '5px' }}
                        onClick={() => setDataType('Range of Seasons Assists')}
                        >
                        Assists
                    </button> <br/> <br/>
                    <button 
                        style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'bold', backgroundColor: 'maroon', color: 'black', borderRadius: '10px', padding: '5px 10px', margin: '5px' }}
                        onClick={() => setDataType('Range of Seasons Rebounds')}
                        >
                        Rebounds
                    </button> <br/> <br/>
            </div>

            <Graph dataType={dataType} addedData={addedData}/>
            
            
      </body>
    </html>
    )
}

export default page