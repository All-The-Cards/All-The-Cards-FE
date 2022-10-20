import { React, useState, useEffect, useContext } from 'react';

import './TagList.css'


const TagList = ({tags, handleDeleteTag, editMode}) => {
    return(
        <>
        {tags.map((tag, index) => (
            <span className="tag" onClick={editMode ? () => (handleDeleteTag(index)) : null}>{tag}</span>
        ))}
        </>
    )
}

export default TagList;