import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Data dummy untuk aktivitas
const activities = [
    {
        id: "1",
        title: "Critical News Analysis",
        skill: "Reading",
        hotsType: "Analyze",
    },
    {
        id: "2",
        title: "Story Creation with Twist",
        skill: "Writing",
        hotsType: "Create",
    },
    {
        id: "3",
        title: "Environmental Issues Debate",
        skill: "Speaking",
        hotsType: "Evaluate",
    },
    {
        id: "4",
        title: "Audio Content Creation",
        skill: "Listening",
        hotsType: "Create",
    },
];

// Data dummy untuk rubrik
const rubrics = [
    { id: "1", name: "HOTS Reading Rubric", maxScore: 100 },
    { id: "2", name: "HOTS Writing Rubric", maxScore: 100 },
    { id: "3", name: "HOTS Speaking Rubric", maxScore: 100 },
    { id: "4", name: "HOTS Listening Rubric", maxScore: 100 },
];

export default function CreateAssignmentPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Create New Assignment</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assignment Details</CardTitle>
                    <CardDescription>
                        Create a new assignment for your students
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='title'>Assignment Title</Label>
                        <Input
                            id='title'
                            placeholder='Enter assignment title'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='activity'>Select Activity</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder='Select an activity' />
                            </SelectTrigger>
                            <SelectContent>
                                {activities.map((activity) => (
                                    <SelectItem
                                        key={activity.id}
                                        value={activity.id}
                                    >
                                        {activity.title} ({activity.skill} -{" "}
                                        {activity.hotsType})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='rubric'>Select Rubric</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder='Select a rubric' />
                            </SelectTrigger>
                            <SelectContent>
                                {rubrics.map((rubric) => (
                                    <SelectItem
                                        key={rubric.id}
                                        value={rubric.id}
                                    >
                                        {rubric.name} (Max: {rubric.maxScore})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !Date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {Date ? (
                                        format(new Date(), "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className='w-auto p-0'
                                align='start'
                            >
                                <Calendar mode='single' initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='instructions'>Instructions</Label>
                        <Textarea
                            id='instructions'
                            placeholder='Enter detailed instructions for students'
                            rows={4}
                        />
                    </div>

                    <div className='flex items-center space-x-2'>
                        <Checkbox id='isChallenge' />
                        <Label htmlFor='isChallenge'>
                            Mark as Weekly Challenge
                        </Label>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button variant='outline'>Cancel</Button>
                        <Button type='submit'>Create Assignment</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
