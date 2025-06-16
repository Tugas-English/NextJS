import { cn } from "@/lib/utils";
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
import Link from "next/link";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl'>Welcome back</CardTitle>
                    <CardDescription>
                        Sign Up to continue with kritica
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className='grid gap-6'>
                            <div className='grid gap-6'>
                                <div className='grid gap-3'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        placeholder='m@example.com'
                                        required
                                    />
                                </div>
                                <div className='grid gap-3'>
                                    <Label htmlFor='name'>name</Label>
                                    <Input
                                        id='name'
                                        type='text'
                                        placeholder='John Doe'
                                        required
                                    />
                                </div>
                                <div className='grid gap-3'>
                                    <div className='flex items-center'>
                                        <Label htmlFor='password'>
                                            Password
                                        </Label>
                                    </div>
                                    <Input
                                        id='password'
                                        type='password'
                                        placeholder='*********'
                                        required
                                    />
                                </div>
                                <div className='grid gap-3'>
                                    <div className='flex items-center'>
                                        <Label htmlFor='confirmPassword'>
                                            Confirm Password
                                        </Label>
                                    </div>
                                    <Input
                                        id='confirmPassword'
                                        type='password'
                                        placeholder='*********'
                                        required
                                    />
                                </div>
                                <Button type='submit' className='w-full'>
                                    Login
                                </Button>
                            </div>
                            <div className='text-center text-sm'>
                                {" "}
                                have an account?{" "}
                                <Link
                                    href='/sign-in'
                                    className='underline underline-offset-4'
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
