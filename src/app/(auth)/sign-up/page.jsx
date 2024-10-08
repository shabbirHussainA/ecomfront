'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm} from "react-hook-form"
import Link from 'next/link'
import axios,{AxiosError} from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from 'react'
import {useDebounceCallback} from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { signUpValidation } from '@/schemas/signupSchema'
// import ApiResponse from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
function page() {
  // creating useState for managing the states
  const [username, setusername] = useState('')
  const [usernameMsg, setusernameMsg] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  // using debounce to pause the callback for 300ms so that api fetch could be minimized
  const debounceUsername = useDebounceCallback(setusername,300)
  // using toast to show notification 
  const { toast } = useToast()
  //creating router to route the page
  const router = useRouter()
  //creating form
  const form = useForm({
    resolver: zodResolver(signUpValidation),//to valdate the format
    defaultValues:{ //setting initial values
      username: '',
      email: '',
      password:'',
    }
  })

  useEffect(() => {

    const usernameCheck = async() =>{
      // if username exist
        if(username){
            setisCheckingUsername(true)
            setusernameMsg('')
            try {
              // fetching the response 
             const response =await axios.get(`/api/check-username-unique?username=${username}`)
            //  set the msg 
             setusernameMsg(response.data.message)
      
            } catch (error) {
              // handling the error using the axiosError
             const AxiosError = error ;
             setusernameMsg(AxiosError.response?.data.message ?? "error checking the uername")
            }finally{
             setisSubmitting(false)
            }
        }
    }
    usernameCheck();
  }, [username]) //will run every time username will change

  //creating onSubmit func to signup user
  const onSubmit = async (data) => {
    data.role = "customer"
    console.log(data)
    setisSubmitting(true);
    
      try {
       const response =await axios.post('/api/sign-up',data)
       if(response.data.success){
         toast({
           title: 'Sign up successful',
           description: response.data?.message
         })
       }else{
        toast({
          title: 'Sign up unsucessfull',
          description: response.data?.message
        })
       }
       router.replace('sign-in')
       setisSubmitting(false);
        
      } catch (error) {
        console.log("error in signup user", error);
        const axiosError = error ;
        let errorMessage = axiosError.response?.data.message
        toast({
          title: 'Sign up unsucessfull',
          description: errorMessage,
          variant:'destructive'
        })
        setisSubmitting(false);
      }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}> //setting the resoler and default values
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'> // for handling onSubmit
            <FormField  // form field username
                  control={form.control} // giving control to the form
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} onChange={(e)=>{
                          field.onChange(e) //setting the field value
                          debounceUsername(e.target.value) //updating the debounceUsername value
                        }} />
                      </FormControl> 
                      {isSubmitting && <Loader2 className='animate-spin'/>}
                      <p className={`text-sm ${usernameMsg === "username is unique" ? 'text-green-500' : "text-red-500"}`} >test: {usernameMsg}</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>email</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field}  />
                      </FormControl> 
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder="shadcn" {...field} />
                      </FormControl> 
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                   {
                    isSubmitting ? (
                      <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait...
                      </>
                    ) : ('Signup')
                   }
                </Button>
            </form>
        </Form>
        <p>
          Already a member?{' '}
          <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">
          Sign In
          </Link>
        </p>
        </div>
        </div>
  )
}

export default page