import register from "@/Assets/register.png";
import login from "@/Assets/login.png";

const AuthLayout = ({
  children,
  route,
}: {
  children: JSX.Element;
  route: string;
}) => {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 bg-muted p-8 flex flex-col justify-between">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Codetective
        </h2>
        <div className="flex justify-center">
          <img
            src={route === "register" ? register : login}
            className="w-7/12"
          />
        </div>
        <p className="text-lg">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam,
          repellat voluptates sed nobis cupiditate eligendi non in numquam!
          Officiis amet ut repellat eaque veniam atque soluta commodi
          dignissimos blanditiis dicta!
        </p>
      </div>
      <div className="flex w-1/2 p-8 justify-center items-center">
        {children}
      </div>
    </div>
  );
};
export default AuthLayout;
