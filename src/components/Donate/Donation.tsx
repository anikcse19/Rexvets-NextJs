"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignUpData } from "@/lib";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { BsIncognito } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "sonner";
import SignIn from "../SignIn";
import DonationBGAnimation from "./DonationBGAnimation";

const Donation: React.FC = () => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);

  const handleClosePopUp = useCallback(() => {
    setShowPopUp(false);
  }, []);

  const handleShowPopUp = useCallback(() => {
    setShowPopUp(true);
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    // Dummy Google sign in
    toast.success("Google sign-in simulated!");
    setShowPopUp(false);
    // router.push("/DonatePage2");
  }, []);

  const handleGoogleSignUp = useCallback(async () => {
    // Dummy Google sign up
    toast.success("Google sign-up simulated!");
    setShowPopUp(false);
    router.push("/DonatePage2");
  }, [router]);

  const handleLoginSubmit = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) {
        toast.error("Fill in all fields!");
        return;
      }
      // Dummy login
      toast.success("Login simulated!");
      setShowPopUp(false);
      router.push("/donation-card-info");
    },
    [router]
  );

  const handleSignupSubmit = useCallback(
    async (data: SignUpData) => {
      const { name, email, password, phone, state, confirmPassword } = data;

      // Check if any field is empty
      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !state ||
        !confirmPassword
      ) {
        toast.error("Please fill all fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      // Dummy signup success
      toast.success("Signup simulated! Welcome.");
      handleClosePopUp();
      router.push("/DonatePage2");
    },
    [router, handleClosePopUp]
  );

  return (
    <>
      <div className="donation-container">
        <DonationBGAnimation />
        <div
          className="w-full  max-w-5xl z-50 mt-8 md:mt-0 bg-white flex flex-col justify-start items-center rounded-[20px] bg-center bg-cover bg-no-repeat  p-4 md:p-8"
          // style={{
          //   backgroundImage: `url('/images/donate-page/Texture.webp')`,
          // }}
        >
          <div className="w-full flex flex-col justify-start items-start p-6 space-y-4">
            <h2 className="font-black text-[#002366] text-3xl text-center w-full">
              Donate
            </h2>
            <p className=" text-lg font-medium text-black text-center w-full">
              Your generous contribution helps us provide essential veterinary
              care to pets in need. Every donation ensures that more animals
              receive the treatment and love they deserve.
            </p>
            <p className="text-base font-medium text-gray-800 text-center w-full">
              Together, we can make a difference in their lives.
            </p>
            {/* <CutePets /> */}
          </div>

          <div className="w-full max-w-4xl flex flex-col justify-center items-start space-y-6 md:space-y-0 md:justify-between md:items-center px-1 md:px-6">
            <p className="font-black self-center w-full text-center md:w-auto md:self-auto">
              Choose donation method
            </p>

            <div className="flex flex-col  md:flex-row w-full justify-center items-center space-y-6 md:space-y-0 md:space-x-6 mt-6">
              {/* Registered Donation */}
              <div className="flex justify-center items-center w-full md:w-1/2 md:p-2.5 ">
                <div className="flex flex-col justify-center items-center p-0 m-0 w-full  md:max-w-[300px]">
                  <button
                    className="flex flex-col p-5 z-50 bg-[#edeef0] items-center justify-center text-center border border-[#b9b8b8] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer hover:border-white hover:bg-[#ffe699] w-full h-[170px]"
                    onClick={handleShowPopUp}
                  >
                    <FaUserAlt className="text-[40px] mb-0 text-[#002366]" />
                    <h5 className="text-black mt-[15px] text-[14px] font-black leading-tight">
                      Registered <br /> donation
                    </h5>
                  </button>
                </div>
              </div>

              {/* Anonymous Donation */}
              <div className="flex justify-center items-center w-full md:w-1/2 md:p-2.5">
                <div className="flex flex-col justify-center items-center p-0 m-0 w-full max-w-[300px]">
                  <div
                    id="AnonymousDonation"
                    className="flex flex-col p-5 z-50  bg-[#edeef0] items-center justify-center text-center border border-[#b9b8b8] rounded-[15px] transition-all duration-300 ease-in-out cursor-pointer hover:border-white hover:bg-[#ffe699] w-full h-[170px]"
                    onClick={() => {
                      router.push("/donation-card-info");
                      // Navigate or other action
                    }}
                  >
                    <BsIncognito className="text-[40px] mb-0 text-[#002366]" />
                    <h5 className="text-black mt-[15px] text-[14px] font-black leading-tight">
                      Anonymous <br /> donation
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog */}
        <Dialog open={showPopUp} onOpenChange={setShowPopUp}>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg p-6 mx-4 my-20">
            <DialogTitle className="sr-only">Sign In</DialogTitle>
            <SignIn
              onGoogleSignIn={handleGoogleSignIn}
              onGoogleSignUp={handleGoogleSignUp}
              onSignIn={handleLoginSubmit}
              onSignUp={handleSignupSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(Donation);
