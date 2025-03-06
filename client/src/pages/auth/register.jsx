import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-[480px] px-4">
        <Card className="shadow-2xl rounded-3xl p-8 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-10 rounded-3xl"></div>
          <CardHeader className="text-center relative z-10">
            <CardTitle className="text-4xl font-extrabold text-foreground">
              Create new account
            </CardTitle>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?
              <Link
                className="font-semibold ml-1 text-primary hover:underline"
                to="/auth/login"
              >
                Login
              </Link>
            </p>
          </CardHeader>
          <CardContent className="relative z-10">
            <CommonForm
              formControls={registerFormControls}
              buttonText={"Sign Up"}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
            />
          </CardContent>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-300 rounded-full blur-xl opacity-50"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-300 rounded-full blur-xl opacity-50"></div>
        </Card>
      </div>
    </div>
  );
}

export default AuthRegister;