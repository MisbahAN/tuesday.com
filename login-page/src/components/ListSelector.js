import React, { useState } from 'react';
import './ListSelector.css';

function ListSelector({ lists, onSelectList, username }) {
    const [selectedListId, setSelectedListId] = useState('');
    const [newListName, setNewListName] = useState('');
    const [createListError, setCreateListError] = useState('');

    const handleListChange = (event) => {
        setSelectedListId(event.target.value);
    };

    const handleSelectList = () => {
        if (selectedListId) {
            onSelectList(selectedListId, username);
        }
    };

    const handleAddList = async (e) => {
        e.preventDefault();

        if (!newListName) {
            setCreateListError('Please enter a list name.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/addList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, list_name: newListName }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('List Added', data);
                // Instead of reloading, refetch the lists
                onSelectList(null,username); //  re-render by calling onSelectList with null
                setNewListName('');
                setCreateListError('');
            } else {
                setCreateListError(data.error || "List Creation Failed");
            }
        } catch (error) {
            console.error('Add list error:', error);
            setCreateListError('Network error or server down.');
        }
    };


    return (
        <div className="list-selector-container">
            <h2>Your Lists</h2>
            <div className="list-select-wrapper">
                <label htmlFor="list-select">Choose a list:</label>
                <select id="list-select" value={selectedListId} onChange={handleListChange} required>
                    <option value="">-- Select a List --</option>
                    {lists.map((list) => (
                        <option key={list.list_id} value={list.list_id}>
                            {list.list_name}
                        </option>
                    ))}
                </select>
                <button className="select-list-button" type="button" onClick={handleSelectList}>
                    Go to List
                </button>
            </div>

            <div className="create-list-form">
                <h2>Create a New List</h2>
                {createListError && <p className="error-message">{createListError}</p>}
                <form onSubmit={handleAddList}>
                    <label htmlFor="list_name">List Name:</label>
                    <input
                        type="text"
                        id="list_name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder='List Name'
                        required
                    />
                    <button type="submit">Create List</button>
                </form>
            </div>
        </div>
    );
}

export default ListSelector;