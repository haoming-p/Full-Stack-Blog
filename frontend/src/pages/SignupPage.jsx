import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, signin, getUsername, updateProfile } from "@/services/apiBlog";
import SmallSpinner from "@/ui_components/SmallSpinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const SignupPage = ({
  setIsAuthenticated,
  setUsername,
  userInfo,
  updateForm,
  toggleModal,
}) => {
  const { register, handleSubmit, formState, reset, watch } = useForm({defaultValues: userInfo? userInfo : {}});
  const { errors } = formState;
  const navigate = useNavigate();
  const password = watch("password");
  const queryClinet = useQueryClient()

  // update
  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: ()=>{
      toast.success('Profile updated successfully')
      toggleModal()
      queryClinet.invalidateQueries({queryKey:['users', userInfo?.username]})
    },
    onError: (err)=>{
      toast.error(err.message)
    }
  })

  // register
  const mutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: async (data) => {
      toast.success("Account created successfully! Logging you in...");
      try {
        // Automatically log the user in after signup
        const loginResponse = await signin({
          username: data.username,
          password: data.password, // Using the same password they just signed up with
        });

        // Store tokens and username in localStorage
        localStorage.setItem("access", loginResponse.access);
        localStorage.setItem("refresh", loginResponse.refresh);

        // Fetch and store the username
        const usernameResponse = await getUsername();
        localStorage.setItem("username", usernameResponse.username);
        setUsername(usernameResponse.username);
        setIsAuthenticated(true);

        toast.success("You are now logged in!");
        navigate("/"); // Redirect to home page
      } catch (err) {
        toast.error("Failed to log in after signup.");
        console.error("Login after signup failed:", err);
      }
      reset();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  function onSubmit(data) {    
    console.log(data)

    if(updateForm){
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('first_name', data.first_name)
      formData.append('last_name', data.last_name)
      formData.append('user_tag', data.user_tag)
      formData.append('bio',data.bio)
      if(data.profile_picture && data.profile_picture[0]){
        if (data.profile_picture[0] != '/'){
          formData.append('profile_picture', data.profile_picture[0])
        }
      }
      updateProfileMutation.mutate(formData)
    }
    else{
      mutation.mutate(data);
    }
  }

  return (
    <form
      className={`${
        updateForm && "h-[90%] overflow-auto"
      } md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-4 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">
          {updateForm ? "Update Profile Form" : "SignUp Form"}
        </h3>
        <p>
          {updateForm
            ? "Tell us more about you!"
            : "Create your account to get started!"}
        </p>
      </div>

      <div>
        <Label htmlFor="username" className="dark:text-[97989F]">
          Username
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="only letters, numbers, and @/./+/-/_ characters"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 1,
              message: "Username must be at least 1 character",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.username?.message && (
          <small className="text-red-700">{errors.username.message}</small>
        )}
      </div>

      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Enter first name"
          {...register("first_name", {
            required: "First name is required",
            minLength: {
              value: 1,
              message: "First name must be at least 1 character",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.first_name?.message && (
          <small className="text-red-700">{errors.first_name.message}</small>
        )}
      </div>

      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Enter last name"
          {...register("last_name", {
            minLength: {
              value: 1,
              message: "Last name must be at least 1 character",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.last_name?.message && (
          <small className="text-red-700">{errors.last_name.message}</small>
        )}
      </div>
      
      {updateForm && <div>
        <Label htmlFor="user_tag">tags</Label>
        <Input
          type="text"
          id="user_tag"
          placeholder=""
          {...register("user_tag", )}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
      </div>}

      {updateForm && <div>
        <Label htmlFor="bio">bio</Label>
        <Textarea
          id="content"
          placeholder="Tell us more about you"
          {...register("bio", )}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
      </div>}

      {updateForm && <div className = 'w-full'>
        <Label htmlFor="profile_picture">Profile Picture</Label>
        <Input
          type = 'file'
          id="picture"
          {...register("profile_picture", )}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
      </div>}


      {!updateForm && <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 1,
              message: "Password must be at least 1 characters",
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.password?.message && (
          <small className="text-red-700">{errors.password.message}</small>
        )}
      </div>}

      {!updateForm && <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirm password"
          {...register("confirmPassword", {
            required: "Password confirmation is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
        />
        {errors?.confirmPassword?.message && (
          <small className="text-red-700">
            {errors.confirmPassword.message}
          </small>
        )}
      </div>}

      <div className="w-full flex items-center justify-center flex-col my-4">
        {updateForm ? (
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
            {mutation.isPending ? (
              <>
                <SmallSpinner />
                <small className="text-[16px]">Updating user...</small>
              </>
            ) : (
              <small className="text-[16px]">Update user profile</small>
            )}
          </button>
        ) : (
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
            {mutation.isPending ? (
              <>
                <SmallSpinner />
                <small className="text-[16px]">Creating user...</small>
              </>
            ) : (
              <small className="text-[16px]">Signup</small>
            )}
          </button>
        )}

        <p className="text-[14px]">
          Already have an account? <a href="/signin">Sign in</a>
        </p>
      </div>
    </form>
  );
};

export default SignupPage;
