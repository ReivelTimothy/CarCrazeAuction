// pages/Home.tsx
import React, { useEffect, useState } from "react";
import Navbar from '../components/navbar';
import { useNavigate } from "react-router-dom";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";

interface UserProfile {
    user_id: string;
    username: string;
    email: string;
}

const Home: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await fetchFromAPI("/user/getUserProfile", "GET");
                setUser(data);
                console.log("User data:", data);
                return data;
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Gagal mengambil data profile.");
                return null;
            }
        };
        fetchUser();
    }, []); 

    return (
        <>
            <Navbar />
            <div className="home-page main-content">
                <h2>Welcome to the Home Page</h2>
                <p>This is the landing page of your app. You can customize it to show a dashboard, welcome message, or latest activity.</p>
                <p>user : {user?.username}</p>
            </div>
        </>
    );
};

export default Home;
