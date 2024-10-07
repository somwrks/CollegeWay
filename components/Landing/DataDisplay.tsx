'use client';

import { useState, useEffect } from 'react';

export default function DataDisplay() {
  const [users, setUsers] = useState([]);
  const [flaskMessage, setFlaskMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const flaskResponse = await fetch('/api/hello');
      const flaskData = await flaskResponse.json();
      setFlaskMessage(flaskData.message);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Users from MongoDB:</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
      <h2>Message from Flask:</h2>
      <p>{flaskMessage}</p>
    </div>
  );
}