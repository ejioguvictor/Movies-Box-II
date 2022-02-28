import React from "react";
import { Link } from "react-router-dom";

import RMDBLogo from "../../images/movies-box.png";
import TMDBLogo from "../../images/tmdb_logo.svg";

import { Wrapper, Content, LogoImg, TMDBLogoImg } from "./Header.styles";

const Header: React.FC = () => (
  <Wrapper>
    <Content>
      <Link to="/">
        <LogoImg src={RMDBLogo} alt="rmdb-logo" />
      </Link>
      <TMDBLogoImg src={TMDBLogo} alt="tmbd.logo" />
    </Content>
  </Wrapper>
);

export default Header;
