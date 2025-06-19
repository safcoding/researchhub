import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#036846] to-[#5edaa7] text-white">
      <div className="m-auto">
        <SignIn 
          appearance={{
            elements: {
              footer: "hidden",
              socialButtonsBlockButton: "hidden",
              formButtonPrimary: 
                "bg-indigo-600 hover:bg-indigo-500",
              footerAction: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
}