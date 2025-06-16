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

export default function CreateActivityPage() {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Create New Activity</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Details</CardTitle>
                    <CardDescription>
                        Fill in the details for your new HOTS activity
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input id='title' placeholder='Enter activity title' />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='skill'>Skill</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select skill' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='reading'>
                                        Reading
                                    </SelectItem>
                                    <SelectItem value='listening'>
                                        Listening
                                    </SelectItem>
                                    <SelectItem value='writing'>
                                        Writing
                                    </SelectItem>
                                    <SelectItem value='speaking'>
                                        Speaking
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='hotsType'>HOTS Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select HOTS type' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='analyze'>
                                        Analyze
                                    </SelectItem>
                                    <SelectItem value='evaluate'>
                                        Evaluate
                                    </SelectItem>
                                    <SelectItem value='create'>
                                        Create
                                    </SelectItem>
                                    <SelectItem value='problem-solve'>
                                        Problem Solve
                                    </SelectItem>
                                    <SelectItem value='infer'>Infer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            placeholder='Enter activity description'
                            rows={4}
                        />
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button variant='outline'>Cancel</Button>
                        <Button type='submit'>Create Activity</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
