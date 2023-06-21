// // react-router-domのインポートを追加
// import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

// import { Home } from "./components/Home";
// import { Page1 } from "./components/Page1";
// import { Page2 } from "./components/Page2";
// import { Page3 } from "./components/Page3";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="App">
//         <Link to="/">Home</Link>
//         <br />
//         <Link to="/Page1">Page1</Link>
//         <br />
//         <Link to="/Page2">Page2</Link>
//         <br />
//         <Link to="/Page3">Page3</Link>
//         <br />

//         <Routes>
//           {/* exactをつけると完全一致になります。Homeはexactをつけてあげます */}
//           {/* <Route exact path="/">
//             <Home />
//           </Route> */}
//           <Route path="/" element={<Home />} />
//           {/* <Route path="/page1">
//             <Page1 />
//           </Route> */}
//           <Route path="/Page1" element={<Page1 />} />
//           {/* <Route path="/page2">
//             <Page2 />
//           </Route> */}
//           <Route path="/Page2" element={<Page2 />} />
//           {/* <Route path="/page3">
//             <Page3 />
//           </Route> */}
//           <Route path="/Page3" element={<Page3 />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import { Login } from "./components/Login";

function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });

  return (
    <>
      <h1>Hello World</h1>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Login />
      </ThemeProvider>
    </>
  );
}

export default App;
