'use client'
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import DataDisplay from "@/components/Landing/DataDisplay";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [nextMessage, setNextMessage] = useState('');
  const [flaskMessage, setFlaskMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const nextResponse = await fetch('/api/getUsers');
      const nextData = await nextResponse.json();
      setNextMessage(nextData);

      const flaskResponse = await fetch('/api/python/hello');
      const flaskData = await flaskResponse.json();
      setFlaskMessage(flaskData.message);
    }
    fetchData();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Next.js with Clerk, MongoDB, and Flask</h1>
        <div>
          <p>Welcome, {user?.firstName}!</p>
          <SignOutButton />
          <DataDisplay />
        </div>
    <div>
      <h2>Users from MongoDB:</h2>
      <ul>
        Message from Nextjs: {}
      </ul>
      <ul>
        Message from Nextjs: {flaskMessage}
      </ul>
    </div>
    </main>
  );
}
