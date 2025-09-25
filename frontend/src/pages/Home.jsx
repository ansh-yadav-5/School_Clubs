import React from 'react'
import { Link } from 'react-router-dom'
import "../App.css";



export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>School Clubs  & Organizations</h1>
        <nav>
          <Link to="/clubs">Clubs</Link>
          <span> | </span>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <main>
        <p>Discover student clubs, join groups, and stay updated.</p>
        <Link to="/clubs">Browse clubs</Link>
      </main>
    </div>
  )
}