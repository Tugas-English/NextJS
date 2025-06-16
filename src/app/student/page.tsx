import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Search } from "lucide-react";

const activities = [
  { id: 1, title: "Analyze the Author's Tone in 'The Great Gatsby'", skill: "Reading", hotsType: "Analyze", status: "Not Started", dueDate: "2025-06-20", points: 150 },
  { id: 2, title: "Evaluate the Logic of a Debate Speech", skill: "Listening", hotsType: "Evaluate", status: "Completed", dueDate: "2025-06-15", points: 200 },
  { id: 3, title: "Create an Alternative Ending for a Short Story", skill: "Writing", hotsType: "Create", status: "Graded", dueDate: "2025-06-12", points: 180 },
  { id: 4, title: "Solve a Real-world Problem via a Spoken Proposal", skill: "Speaking", hotsType: "Problem-solve", status: "Not Started", dueDate: "2025-06-25", points: 250 },
  { id: 5, title: "Infer the Meaning of Unfamiliar Words from Context", skill: "Reading", hotsType: "Infer", status: "In Progress", dueDate: "2025-06-22", points: 120 },
  { id: 6, title: "Write a Critical Review of a Movie", skill: "Writing", hotsType: "Evaluate", status: "Not Started", dueDate: "2025-06-28", points: 160 },
];

const hotsTypes = ["Analyze", "Evaluate", "Create", "Problem-solve", "Infer"];

const badgeColors = {
  Reading: "bg-blue-100 text-blue-800",
  Listening: "bg-purple-100 text-purple-800",
  Writing: "bg-pink-100 text-pink-800",
  Speaking: "bg-orange-100 text-orange-800",
  Analyze: "border-sky-500 text-sky-500",
  Evaluate: "border-amber-500 text-amber-500",
  Create: "border-emerald-500 text-emerald-500",
  "Problem-solve": "border-red-500 text-red-500",
  Infer: "border-indigo-500 text-indigo-500",
  "Not Started": "bg-gray-200 text-gray-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Graded: "bg-green-200 text-green-900 font-semibold",
};

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Weekly HOTS Challenge */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">🏆 Weekly HOTS Challenge</CardTitle>
          <CardDescription>Tantangan baru setiap minggu untuk mengasah skill Anda ke level selanjutnya!</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg">"Write an opinion letter about the future of AI in education."</h3>
          <p className="text-sm text-muted-foreground mt-2">Kumpulkan sebelum 23 Juni 2025 untuk mendapatkan <strong>300 XP</strong> dan <strong>badge eksklusif</strong>!</p>
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Mulai Tantangan</Button>
        </CardFooter>
      </Card>

      {/* 2. HOTS Activity Explorer */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">🧠 HOTS Activity Explorer</h2>
        <Tabs defaultValue="all-skills">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all-skills">All Skills</TabsTrigger>
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="listening">Listening</TabsTrigger>
              <TabsTrigger value="writing">Writing</TabsTrigger>
              <TabsTrigger value="speaking">Speaking</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search activities..." className="pl-8 w-full md:w-[300px]" />
            </div>
          </div>
          <Separator className="my-4" />

          {/* Filter by HOTS Type */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-sm font-medium">Filter by HOTS type:</span>
            {hotsTypes.map(type => (
              <Badge key={type} variant="outline" className={`cursor-pointer hover:bg-accent ${badgeColors[type as keyof typeof badgeColors]}`}>
                {type}
              </Badge>
            ))}
          </div>

          <TabsContent value="all-skills">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mapping dari data aktivitas */}
              {activities.map(activity => (
                <Card key={activity.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-semibold leading-snug">{activity.title}</CardTitle>
                      <Badge className={badgeColors[activity.skill as keyof typeof badgeColors]}>{activity.skill}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <Badge variant="outline" className={badgeColors[activity.hotsType as keyof typeof badgeColors]}>{activity.hotsType}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                    <div>
                        <span>Due: {activity.dueDate}</span>
                    </div>
                    <Badge variant="secondary" className={badgeColors[activity.status as keyof typeof badgeColors]}>{activity.status}</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}