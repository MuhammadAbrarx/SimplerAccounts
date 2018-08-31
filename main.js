const electron = require('electron');
const url = require('url');//core node js module
const path = require('path');
const ipcMain = require('electron');

const {app,BrowserWindow,Menu} = electron;

// SET ENV
// Enable or Disable Production Mode
// process.env.NODE_ENV = "production";

let mainWindow;
let newInvoiceWindow;

//Listen for the app to be ready

app.on('ready',function(){
	//create new window
	mainWindow = new BrowserWindow();
	//Load main window here
	mainWindow.loadURL(url.format(
	{
		pathname: path.join(__dirname,'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));//this basically is passing file://dirname/mainWindow.html

	//Quit Entire App when closed
	mainWindow.on('closed',function()
	{
		app.quit();
	});

	//On finished loading the window
	mainWindow.on('did-finish-load',function()
	{
	
	});

	
	//Building Menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

	//Insert the menu
	Menu.setApplicationMenu(mainMenu);

});

//Create menu template
const mainMenuTemplate = [

	{
		label: 'File',
		submenu:[
			{
				label:'New Order/Invoice',
				click()
				{
					createPreviewNewOldInvoiceWindow();
				}	
			},
			{
				label:'View Invoices'
			},
			{
				label:'View Summary'
			},
			{
				label:'Exit',
				accelerator: process.platform = 'darwin'? 'Command+Q' : 'Ctrl+Q',
				click()
				{
					app.quit();
				}
			}
		]
	},{

		label: 'Contact',
		submenu:[
			{
				label:'Add Contact'
			},
			{
				label:'View Contacts'
			}
		]
	},{

		label:'Product',
		submenu:[
			{
				label:'Add Product'
			},
			{
				label:'View Contacts'
			}	
		]
	}
];


//If mac had empty object to menu
if(process.platform=='darwin')
{
	mainMenuTemplate.unshift({});
}

// Add developer tools if not in production
if(process.env.NODE_ENV!=='production')
{
	mainMenuTemplate.push({
		label:'Developer Tools',
		submenu:[
			{
				label: 'Toggle DevTools',
				accelerator: process.platform=='darwin'?'Command+Q':'Ctrl+Q',
				click(item,focusedWindow)
				{
					focusedWindow.toggleDevTools();
				}
			},
			{
				role:'reload'
			}
		]
		
	});
}

//Build Contextual Menu As Well



