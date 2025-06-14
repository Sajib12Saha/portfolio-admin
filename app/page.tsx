import { LoginForm } from "@/components/form/login-form";


const  Home = () =>{
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-y-8">
      <h1 className="text-2xl font-bold">Welcome to CMS Admin</h1>
         <LoginForm/>
    </div>
   
  );
}

export default Home;
