import styles from "./topNavigationBar.module.css";
import { Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import logo from '../assets/logo.jpg';

export const TopNavigationBar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className={styles.header}>
      <Container>
        <Navbar.Brand href="/" className={styles.logo}>
          <img src={logo} alt="로고" width="200" height="200" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">아무거나</Nav.Link>
            <Nav.Link href="/">아무거나</Nav.Link>
            <NavDropdown title="상품" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">일단</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">아무거나</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">넣어봐</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">ㅋㅋㅋ</NavDropdown.Item>
            </NavDropdown>

  
          </Nav>
          <Nav>
            <div className={styles.input_wrap}>
              <input type="text" placeholder="상품을 검색해보세요!" />
            </div>
            

            <Nav.Link href="#deets">로그인</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">장바구니</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>

  );
};
