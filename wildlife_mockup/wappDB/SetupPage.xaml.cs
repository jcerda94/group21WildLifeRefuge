using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using DebugStuff;

namespace wappDB
{
    public partial class Page1 : System.Windows.Controls.Page
    {
        private DBConnect myDB;

        void Click_ListUsers(object sender, RoutedEventArgs e)
        {
            var list = myDB.GetUsers();
            int i = 0;
            foreach (var item in list)
            {
                MyDebug.DPrint(Global.sprintf("List[{0}]: {1}", i++, item.ToString()));
                TBOutput.Text += item.ToString();
                TBOutput.Text += "\r\n";
            }
        }

        void home_clk   (object sender, RoutedEventArgs e) 
        {
            MyDebug.DPrint(Global.sprintf("navigate to home"));
        }
        void gallery_clk(object sender, RoutedEventArgs e)
        {
            NavigationService ns = NavigationService.GetNavigationService(this);
            ns.Source = new Uri("Page2.xaml", UriKind.Relative);

            MyDebug.DPrint(Global.sprintf("navigate to gallery"));
            //// Instantiate page to navigate to
            //PageWithNonDefaultConstructor page = 
            //    new PageWithNonDefaultConstructor(DateTime.Now);
            //// Get navigation service
            //this.NavigationService.Navigate(page);
        }
        void contact_clk(object sender, RoutedEventArgs e)
        {
            MyDebug.DPrint(Global.sprintf("navigate to contacts"));
        }


        void b1_clk(object sender, RoutedEventArgs e) { }
        void b2_clk(object sender, RoutedEventArgs e) { }
        void b3_clk(object sender, RoutedEventArgs e) { }
        void b4_clk(object sender, RoutedEventArgs e) { }
        void b5_clk(object sender, RoutedEventArgs e) { }
        void b6_clk(object sender, RoutedEventArgs e) { }
        void b7_clk(object sender, RoutedEventArgs e) { }
        void b8_clk(object sender, RoutedEventArgs e) { }
        void b9_clk(object sender, RoutedEventArgs e) { }
        void b10_Clk(object sender, RoutedEventArgs e) { }

        void Click_NewButton(object sender, RoutedEventArgs e)
        {
        }

        void Top_Horz_Dock_keyUp(object sender, RoutedEventArgs e)
        {
        }
        public Page1()
        {
            InitializeComponent();
            myDB = new DBConnect();

            //nbrush = new LinearGradientBrush(Colors.White, Colors.PeachPuff, 90);
            //obrush = new LinearGradientBrush(Colors.White, Colors.LightGray, 90);            
 
            //wb.NavigateToString("hello <a href='http://bing.com'>bing</a>");
            string str = "<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\">"
            + @"<head>"
            + "    <meta charset=\"utf-8\" />"
            + "    <title>my title</title>"
            + "</head>"
            + "<body>"
            + "    <p>"
            + "        <input id=\"Button1\" type=\"button\" value=\"button\" /></p>"
            + "    <p>"
            + "        <input id=\"Text1\" type=\"text\" /></p>"
            + "    <p>"
            + "        <textarea id=\"TextArea1\" cols=\"20\" name=\"S1\" rows=\"2\"></textarea></p>"
            + "</body>"
            + "</html>";

            //currentTurn = 0;
        }
    }
}