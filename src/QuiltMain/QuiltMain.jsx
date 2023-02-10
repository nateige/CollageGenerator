import React, { Component , useState, useEffect} from 'react';
import axios, { formToJSON } from 'axios';
import './imgStyle.css';
import Pagination from '../Pagination/Pagination';
import parse from 'html-react-parser'

function QuiltMain() {


    // Use state for the full initial API request
    const [bigQuilt, setBigQuilt] = useState([])

    // Use state for image collages from the full API request
    const [quilts, setQuilts] = useState([])

    // Use state for the size of the full API request, used to determine if data has been pulled
    const [photoLen, setPhotoLength] = useState(0)
    const [qData, setQuiltData] = useState([0,0,0,0])

    // Use state for the current page displayed on the webpage
    const [currentPage, setCurrentPage] = useState(1)

    // Use state to ensure that data is only pulled once on load
    const [dataRequest, setDataRequested] = useState(false)

    // Determines which quilts are displayed on the current page
    const IndexOfLastQuilt = currentPage * qData[3]
    const IndexOfFirstQuilt = IndexOfLastQuilt - qData[3]
    const currentQuilts = quilts.slice(IndexOfFirstQuilt, IndexOfLastQuilt) 

    var qRows = 0
    var qCols = 0
    var qNum = 0 
    var qPerPage = 0

    var quilt = []
    var quiltCollection = []
    var qTags = []
    let newQData = []

    useEffect(() =>{

      // Fetch data once on page-load
      if(!dataRequest){
        const fetchData = async () => {
          const response = await fetch(`https://jsonplaceholder.typicode.com/photos`);
          const newData = await response.json();

          console.log("|RESPONSE|", response)
          console.log("|UE DATA|", newData)

          setBigQuilt(newData)
          
        };
        setDataRequested(true)
        fetchData()
      }

      // Re-render page when user input changes
    }, [quilts, qData])
    

    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    // Set Quilt Row, Column, Number, and PerPage values from user input
    async function setQData(){

        qRows = document.getElementById("quiltRows").value
        qCols = document.getElementById("quiltCols").value
        qNum = document.getElementById("quiltNum").value
        qPerPage = document.getElementById("quiltPP").value

        newQData = [qRows, qCols, qNum, qPerPage]

        setQuiltData( newQData)
   
        setPhotoLength(2)
        
        // Generate new quilts on page per user input
        makeQuilt(qRows,qCols, qNum, bigQuilt)
      
    }

    // Makes an X by Y collage of images from bigQuiltPics array
    async function makeQuilt(x, y, num, bigQuiltPics){

      // Initial data request retreives 5000 photos.
      // Select a random index from those photos.
      let counter = randomIntFromInterval(0,5000)
      let i = 0
    
      // Generate random assortment of photos beginning from the random index.
      for(let j = 0; j < num ; j++){

        for(i = counter ; i < (counter + (x * y)) ; i++){
          if (i > 4999){
            i = randomIntFromInterval(0, 5000)
          //
          }
          quilt.push(bigQuiltPics[i])
        }
        counter = i
        quiltCollection.push(quilt)
        quilt = []

    }

      // Parse json data for each data element and generate html <img> elements
      let qStr = ""
      let qCounter = 1
      let qHTML = null
      for(let i  = 0; i < quiltCollection.length; i++){
        for(let j = 0; j < quiltCollection[i].length; j++){
          
          // If we've reached the end of a single collage, append HTML string to HTML array.
          if(qCounter == (x*y)){

            qStr += "<img src=\"" + quiltCollection[i][j].thumbnailUrl + "\"></img>"
            qHTML = parse(qStr)
            qTags.push(qHTML)
            qStr = ''
            qCounter = 1

            //Continue to prevent qCounter from being incremented at the end of the nested loop
            continue
          }
          //If we've reached the end of the collage row, append a break line 
          else if( ((qCounter) % y ==  0) ){

            qStr += "<img src=\"" + quiltCollection[i][j].thumbnailUrl + "\"></img><br>"
          }
          // Append individual photo tags to each other to create a collage
          else{
            qStr += "<img src=\"" + quiltCollection[i][j].thumbnailUrl + "\"></img>"
          }
          qCounter++
        }
    
      }
      setQuilts(qTags)

    }

    // Generate a random number from the min-max range
    function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return (
      <div>

      <div id="heading">Create A Quilt</div>
      <div id="label_bar">

      {/* User input boxes */}  
      Quilt Rows  &ensp;<input type="text" id="quiltRows"/> &ensp;
      Quilt Columns &ensp;<input type="text" id="quiltCols"/> &ensp;
      Number of Quilts &ensp;<input type="text" id="quiltNum"/> &ensp;
      Quilts Per Page &ensp;<input type="text" id="quiltPP"/> &ensp;
      <button onClick={setQData}>Set Quilt Data</button>
      </div>

        {(photoLen > 1)  &&
        <div>

       {/* Loop through and display each element in collage array */}
        {
          currentQuilts.map((quilt, idx) => {
            
            return(
            <div>
            <h1>Quilt #{idx + 1}</h1>
            <div key={idx}>{quilt}</div>  
            </div>
            )
            
          })
        }
        
        </div>}

        {/* Create page buttons to sort through collages */}
        {(qData.length > 1) &&

        <div>
          <Pagination
          totalQuilts={qData[2]}
          quiltsPerPage={qData[3]}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          />

        </div> 
        }

      </div>
    );
  }
  

export default QuiltMain;