import Sidebar from "@/components/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="bg-[#3b3e46] h-screen p-[20px] flex">
      <Sidebar />
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
