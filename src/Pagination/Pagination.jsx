import React from 'react';

const Pagination = ({totalQuilts, quiltsPerPage, setCurrentPage}) => {

    let pages = [];
    
    for(let i = 0; i < Math.ceil(totalQuilts/quiltsPerPage); i++){
        pages.push(i+1)
    }


    return (
    <div>
        {
          pages.map((page,index) =>{
          return <button key={index} onClick = {() => setCurrentPage(page)}>{page}</button>
          })

        }
    </div>
    );  
}

export default Pagination;