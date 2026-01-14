import { FC, ReactNode } from "react";
import { Footer, Header, SideMenu } from "../components";

interface LayoutInterface {
  children: ReactNode;
}

const Layout: FC<LayoutInterface> = ({ children }: LayoutInterface) => {
  return (
    <section id="container">
      <Header />
      <SideMenu />
      {children}
      <Footer />
    </section>
  );
};

export default Layout;
