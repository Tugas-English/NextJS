import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const submission = {
    id: "3",
    assignmentId: "1",
    assignmentTitle: "Analyzing News Articles",
    studentName: "Budi Santoso",
    studentId: "S12345",
    submittedAt: "2024-07-13 16:45",
    textResponse: `In this news article about climate change, I identified several instances of bias and rhetorical devices.

The author uses emotional language when describing the "devastating" effects of climate change, which appeals to the reader's emotions (pathos). There's also an appeal to authority by quoting multiple scientists and experts.

The perspective is primarily from environmentalists and climate scientists, with less representation from industry or economic viewpoints. This creates a somewhat one-sided narrative, though the science is well-supported.

Rhetorical devices include metaphors comparing climate change to a "ticking time bomb" and repetition of phrases like "urgent action" to emphasize the time-sensitive nature of the issue.

The article uses statistics selectively, highlighting the most alarming projections while giving less attention to more moderate scenarios.`,
    status: "pending",
    score: null,
};

// Data dummy untuk rubrik
const rubric = {
    name: "HOTS Reading Rubric",
    maxScore: 100,
    criteria: [
        {
            id: "1",
            name: "HOTS Integration",
            description:
                "Sejauh mana siswa menerapkan keterampilan berpikir tingkat tinggi",
            maxScore: 25,
        },
        {
            id: "2",
            name: "Analysis Depth",
            description: "Kedalaman analisis terhadap teks yang diberikan",
            maxScore: 25,
        },
        {
            id: "3",
            name: "Evidence & Support",
            description: "Penggunaan bukti dari teks untuk mendukung argumen",
            maxScore: 25,
        },
        {
            id: "4",
            name: "Language & Structure",
            description: "Kejelasan bahasa dan struktur respons",
            maxScore: 25,
        },
    ],
};

export default function EvaluateSubmissionPage({
    params,
}: {
    params: { id: string; submissionId: string };
}) {
    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon' asChild>
                    <Link href={`/teacher/assignments/${params.id}`}>
                        <ArrowLeft className='h-4 w-4' />
                    </Link>
                </Button>
                <h1 className='text-2xl font-bold'>Evaluate Submission</h1>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission Details</CardTitle>
                            <CardDescription>
                                {submission.assignmentTitle}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Student
                                        </p>
                                        <p className='font-medium'>
                                            {submission.studentName}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Submitted At
                                        </p>
                                        <p className='font-medium'>
                                            {submission.submittedAt}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Student Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='whitespace-pre-wrap border rounded-md p-4 bg-muted/30'>
                                {submission.textResponse}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Rubric Evaluation</CardTitle>
                            <CardDescription>
                                {rubric.name} (Max: {rubric.maxScore} points)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {rubric.criteria.map((criterion) => (
                                <div key={criterion.id} className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <Label>{criterion.name}</Label>
                                        <span className='text-sm'>
                                            0/{criterion.maxScore}
                                        </span>
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        {criterion.description}
                                    </p>
                                    <Slider
                                        defaultValue={[0]}
                                        max={criterion.maxScore}
                                        step={1}
                                    />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <div className='w-full'>
                                <Label htmlFor='feedback'>
                                    Feedback untuk Siswa
                                </Label>
                                <Textarea
                                    id='feedback'
                                    placeholder='Berikan feedback yang konstruktif untuk siswa'
                                    className='mt-2'
                                    rows={4}
                                />
                            </div>
                        </CardFooter>
                    </Card>

                    <div className='flex justify-between'>
                        <Button variant='outline' asChild>
                            <Link href={`/teacher/assignments/${params.id}`}>
                                Cancel
                            </Link>
                        </Button>
                        <div className='space-x-2'>
                            <Button variant='outline'>Save Draft</Button>
                            <Button>Submit Evaluation</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
