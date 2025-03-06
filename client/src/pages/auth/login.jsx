
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="fixed inset-y-0 right-13 flex items-center min-h-screen px-4 bg-gradient-to-r overflow-auto">
  <Card className="w-full max-w-2xl shadow-2xl rounded-3xl p-8 bg-white relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-10 rounded-3xl"></div>
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-4xl font-extrabold text-foreground">
            Sign in to your account
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?
            <Link
              className="font-semibold ml-1 text-primary hover:underline"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
        </CardContent>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-300 rounded-full blur-xl opacity-50"></div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-300 rounded-full blur-xl opacity-50"></div>
      </Card>
    </div>
  );
}

export default AuthLogin;

