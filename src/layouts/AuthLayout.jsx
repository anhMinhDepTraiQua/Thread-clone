import { Outlet } from "react-router";
export default function AuthLayout() {
  return (
    <div  className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden"
      style={{
        backgroundImage: `url("https://static.cdninstagram.com/rsrc.php/v4/ym/r/_qas8NM9G0b.png")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "contain",
        backgroundSize: "85%",
      }}>
      <Outlet />
    </div>
  );
}