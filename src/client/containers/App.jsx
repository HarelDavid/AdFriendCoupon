import React from 'react'
// import Menu from '../components/Menu.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey800} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
	isRtl: true,
	palette: {
		primary1Color: "#585D91",
		accent1Color: "#50BAB4",
		textColor: grey800,
	}
});



var menuData = [
  {title: "Home", path:""},
  {title: "Browse", path:"Browse?wait=1000"},
  {title: "About", path:"about"},
  {title: "Not Found", path:"this_url_doesnt_exist"},
]

export default class App extends React.Component {
    render(){
        return <MuiThemeProvider className="container" muiTheme={muiTheme}>
            {/*<Menu prefix='/' data={menuData} />*/}
            {this.props.children}
        </MuiThemeProvider>
    }
}
