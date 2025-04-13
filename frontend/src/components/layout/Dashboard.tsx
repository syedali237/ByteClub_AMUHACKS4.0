
import { useEffect, useState } from "react";
import Header from "./Header";
import CreateQuizModal from "../quiz/CreateQuizModal";
import QuizGrid from "../quiz/QuizGrid";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import Footer from "./Footer";
import axios from "axios";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    
    const fetchQuizzes = async () => {
      try {
        const userInfo = localStorage.getItem("user");
        const user = JSON.parse(userInfo);
        console.log(user);
        
        const token = user.access_token;

        const response = await axios.get(
          "http://localhost:8000/quiz/quizzes/",
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        console.log("Fetched quizzes:", response.data);
        setQuizzes(response.data); // Now you can set the quizzes in state
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes(); 
  }, []); 
  

  const handleQuizCreated = (newQuiz: any) => {
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">
              Create and manage quizzes for your children.
            </p>
          </div>
          
          <CreateQuizModal onQuizCreated={handleQuizCreated} />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Quizzes</TabsTrigger>
            {/* <TabsTrigger value="recent">Recent</TabsTrigger> */}
          </TabsList>
          
          <TabsContent value="all">
            <QuizGrid quizzes={quizzes} />
          </TabsContent>
          
          {/* <TabsContent value="recent">
            <QuizGrid 
              quizzes={quizzes.slice(0, 2)} 
            />
          </TabsContent> */}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
