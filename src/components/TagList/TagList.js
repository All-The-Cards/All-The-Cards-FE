import { React, useState, useEffect, useContext } from 'react';

import './TagList.css'


const TagList = ({tags, handleDeleteTag, editMode}) => {
    return(
        <>
        {tags.map((tag, index) => (
            <span key={index} 
                className="tag" 
            // onClick={editMode ? () => (handleDeleteTag(index)) : null}
            ><div className="tagText">{tag}</div>{editMode && <div className='tagDelete' onClick={() => { handleDeleteTag(index) }}>x</div>}</span>
        ))}
        </>
    )
}

export default TagList;