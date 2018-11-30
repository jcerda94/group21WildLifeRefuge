using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.IO;
using DebugStuff;
#if __IOS__
//using UIKit;
#endif

namespace EqE_App
{
    public class Dynamics
    {
        public static string NamedPtr(object obj)
        {
            if(obj == null) return "-null-";
            Type t = obj.GetType();
            string ret = "Unknown";
            try
            {
                if     ( obj is MyStack)                { ret =               ((MyStack)obj).SS_NamedPtr ; }
                else if (obj is MyFileEntry)            { ret =           ((MyFileEntry)obj).SS_NamedPtr + "  Checked: " + ((MyFileEntry)obj).isChecked; } 
                else if (obj is MyView_Stk)             { ret =            ((MyView_Stk)obj).SS_NamedPtr ; } 
                else if (obj is MyDialogBase)           { ret =            ((MyView_Stk)obj).SS_NamedPtr ; } 
                else if( obj is MyNode)                 { ret =                ((MyNode)obj).LB_NamedPtr ; }
                else if( obj is MyBase)                 { ret =                ((MyBase)obj).LB_NamedPtr ; }
                else if( obj is MyProject)              { ret =             ((MyProject)obj).NamedPtr ; }
                else if (obj is MyPhysicalView)         { ret =        ((MyPhysicalView)obj).NamedPtr ; } 
                else if (obj is XAM_MyView)             { ret =            ((XAM_MyView)obj).Owner.NamedPtr + "_:___" + "XAM_MyBoxView"; }
                else if (obj is String)                 { ret =                 (String)obj; }
                else if (obj is APP.TouchInfo)          { ret =         ((APP.TouchInfo)obj).ToString(); }
                else if (obj is TMA_Cloud.MyFileInfo)   { ret =  ((TMA_Cloud.MyFileInfo)obj).ToString(); }
                else if (obj is MyCntxCloud.CB_Org_Entry)   { ret =  ((MyCntxCloud.CB_Org_Entry)obj).ToString(); }
                #if __WINFORMS__
                //else if (t.Equals(typeof(EqE_App_Win.MainWindow))) { ret =((EqE_App_Win.MainWindow)obj).NamedPtr + " _30_"; }
                #elif __XAMARIN__
                    else if (obj is MyScrollView)           { ret =          ((MyScrollView)obj)._myView_Stk.SS_NamedPtr ; } 
                	else if (obj is MyPageLayout)           { ret =          ((MyPageLayout)obj).NamedPtr ; } 
                    #if __ANDROID__
                    else if (t.Equals(typeof(Drd_Shape)))           { ret =          "Drd_Shape"; } //+ "_:___" + "MySection"; }
                    #else
                    else if (t.Equals(typeof(ShapeRenderer)))           { ret =          "Drd_Shape"; } //+ "_:___" + "MySection"; }
                    #endif
                #elif __MAC__
                    else if (obj is MyScrollView)                   { ret =          ((MyScrollView)obj)._myView_Stk.SS_NamedPtr ; } 
                #endif
                else
                {
                    ret = obj.GetType().ToString();
                    MyDebug.DoAssert(false, "fix NamedPtr for: " + ret);
                }
            }
            catch (Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "A. fix NamedPtr for: " + t.ToString());
            }
            return ret;
        }
        public static string NamedPtr_rect(object obj)
		{
            //MyDebug.DPrint(Global.sprintf("here"));
            if(obj == null) return "null";
            Type t = obj.GetType();
            string ret = "Unknown";
            try
            {
            	if (     t.Equals(typeof(MyPhysicalView)))         { ret =       NamedPtr(obj) +((MyPhysicalView)obj)._myView_Stk.Get_myRect_ReadOnly().ToString(); }
                else if( is_MyBase_Type(obj))                      { ret =       NamedPtr(obj) +        ((MyBase)obj).Get_myRect_ReadOnly().ToString(); }
            	else if (t.Equals(typeof(MyView_Stk)))             { ret =       NamedPtr(obj) +  ((MyView_Stk)obj).myRect.ToString(); }
                #if __XAMARIN__
                else if (t.Equals(typeof(MyPageLayout)))           { ret =       NamedPtr(obj) +  ((MyPageLayout)obj).myRect.ToString(); }
              	else if (obj is MyScrollView)                      { ret =       NamedPtr(obj) +  ((MyScrollView)obj).myRect.ToString(); }
                else if( t.Equals(typeof(XAM_MyView)))             { ret =       NamedPtr(obj) +     new MyRectangle(((XAM_MyView)obj).X, ((XAM_MyView)obj).Y, ((XAM_MyView)obj).Width, ((XAM_MyView)obj).Height).ToString(); }
                #elif __MAC__
                else if (obj is MyScrollView)                      { ret =       NamedPtr(obj) +  ((MyScrollView)obj)._myView_Stk.myRect.ToString(); }
                #endif 
            	else { ret = obj.GetType().ToString(); }
            }
            catch (Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "fix NamedPtr_rect for: " + t.ToString());
            }
            return ret;
		}

        public static string DumpExtraStuff(object obj) 
        {
            string ret = null;
            try
            {
                Type t = obj.GetType();
            	if      (t.Equals(typeof(MyKey)))                         { ret =           ((MyKey)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyNode)))                        { ret =          ((MyNode)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyTextField)))                   { ret =     ((MyTextField)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                //else if (t.Equals(typeof(MyNode_Frac)))                   { ret =     ((MyNode_Frac)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                else if (t.Equals(typeof(MyBase)))                        { ret =          ((MyBase)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                #if __MyEQE__
                else if (t.Equals(typeof(MyEqRow)))                       { ret =         ((MyEqRow)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                else if (t.Equals(typeof(MyEqLabel)))                     { ret =       ((MyEqLabel)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyStack)) 
            	      || t.Equals(typeof(MyCell))
            	      || t.Equals(typeof(MyEqRow)))                       { ret =         ((MyStack)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	//else if (t.Equals(typeof(MyFilePickerDiag))
            	//      || t.Equals(typeof(MySection)))                     { ret =      ((MyView_Stk)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MySection)))                     { ret =      ((MyView_Stk)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                #endif //__MyEQE__
                else if (t.Equals(typeof(MyButton)))                      { ret =        ((MyButton)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyPage)))                        { ret =          ((MyPage)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyPhysicalView)))                   { ret =     ((MyPhysicalView)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                #if __XAMARIN__
                else if (t.Equals(typeof(XAM_MyView)))                 { ret =     " ";}                                             
            	else if (t.Equals(typeof(MyScrollView)))                  { ret =    ((MyScrollView)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                #elif __MAC__
            	else if (t.Equals(typeof(MyScrollView)))                  { ret =    ((MyScrollView)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
                #endif //__XAMARIN__
            	else if (t.Equals(typeof(MyMenuItem)))                    { ret =      ((MyMenuItem)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyStack)))                       { ret =         ((MyStack)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else if (t.Equals(typeof(MyMsgBox))
            	      || t.Equals(typeof(MyPage))
            	      || t.Equals(typeof(MyKeyboard))
            	      || t.Equals(typeof(MyDialog_Image))
            	      || t.Equals(typeof(MyEnter))
            	      || t.Equals(typeof(MyToolTip))
            	      || t.Equals(typeof(MyDialog_Template))
            	      || t.Equals(typeof(MyView_Stk)))                    { ret =      ((MyView_Stk)obj).DumpExtraStuff() + "   "  +    Dynamics.ShowBackgroundColor(obj); }
            	else
                {
                    //MyDebug.DoAssert(false, "fixme: Handle all types here: " + t.ToString());
                    ret = "";
                }
            }
            catch(Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "fixme: Handle all types here: " + obj.GetType().ToString());
            }
            return ret;
        }
        public static string ShowBackgroundColor(object obj) 
        {
            MyColor ret = null;
            try
            {
                Type t = obj.GetType();
            	if      (t.Equals(typeof(MyPhysicalView)))                   { return "no-color"; }   
                #if __XAMARIN__ || __MAC__
            	else if (t.Equals(typeof(MyScrollView)))                  { return "no-color"; }
                #endif //__XAMARIN__ || __MAC__

                if( is_MyBase_Type(obj) )                                 { ret =     ((MyBase)    obj)._myBackgroundColor; }
            	else if (t.Equals(typeof(MyPage)))                        { ret =     ((MyPage)          obj)._myBackgroundColor; }
            	else if (t.Equals(typeof(MyDialog_Template)))             { ret =     ((MyDialog_Template) obj)._myBackgroundColor; }
            	else if (t.Equals(typeof(MyDialog_Image)))                { ret =     ((MyDialog_Image)    obj)._myBackgroundColor; }
            	else if (t.Equals(typeof(MyView_Stk)))                    { ret =     ((MyView_Stk)      obj)._myBackgroundColor; }
            	else
                {
                    MyDebug.DoAssert(false, "fixme: Handle all types here: " + t.ToString());
                }
                if( ret != null ) return ret.ToString();
            }
            catch(Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "fixme: Handle all types here: " + obj.GetType().ToString());
            }
            return "-null-";
        }

        //public static MySize GetMySize(dynamic obj) // IOS and MAC don't support 'dynamic' very well, if at all
        public static MySize GetMySize_copy(object obj) 
        {
            MySize ret = null;
            try
            {
                Type t = obj.GetType();
                if( is_MyBase_Type(obj) )                                 { ret =    ((MyBase)obj).mySize_RO; }
            	else if (t.Equals(typeof(MyPage)))                        { ret =          ((MyPage)obj).mySize_RO; }
            	else if (t.Equals(typeof(MyPhysicalView)))                   { ret =     ((MyPhysicalView)obj)._myView_Stk.mySize_RO; }
                #if __XAMARIN__ 
                else if (t.Equals(typeof(MyPageLayout)))                  { ret =    ((MyPageLayout)obj).mySize; }
                #endif //__XAMARIN__ 
            	else if (t.Equals(typeof(MyView_Stk)))                    { ret =    ((MyView_Stk)obj).mySize_RO; }
            	else
                {
                    MyDebug.DoAssert(false, "fixme: Handle all types here: " + t.ToString());
                }
            }
            catch(Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "fixme: Handle all types here:  " +obj.GetType().ToString());
            }
            return new MySize(ret);
        }

        public static bool isEqualTo(MyBase obj_1, MyBase obj_2, string indent) 
        {
            // handle ALL classes derived from MyBase here
            bool ret = false;
            try
            {
                //MyDebug.DPrint(Global.sprintf("{0}{1,-22}     vs.     {2,22}", indent, Tools.NamedPtr(obj_1), Tools.NamedPtr(obj_2)));
                Type t = obj_1.GetType();
                Type t2 = obj_2.GetType();
                if( !t.Equals(t2) ) return false;
            	if      (t.Equals(typeof(MyKey)))                         { ret =           ((MyKey)obj_1).isEqualTo(indent, obj_2); }
            	else if (t.Equals(typeof(MyNode)))                        { ret =          ((MyNode)obj_1).isEqualTo(indent, obj_2); }
                else if (t.Equals(typeof(MyTextField)))                   { ret =     ((MyTextField)obj_1).isEqualTo(indent, obj_2); }
            	else if (t.Equals(typeof(MyStack)))                       { ret =         ((MyStack)obj_1).isEqualTo(indent, obj_2); }
            	else if (t.Equals(typeof(MyView_Stk)))                    { ret =      ((MyView_Stk)obj_1).isEqualTo(indent, obj_2); }
                else if (t.Equals(typeof(MyBase)))                        { ret =    ((MyBase)obj_1).isEqualTo(indent, obj_2); }
                #if __MyEQE__
                else if (t.Equals(typeof(MyEqLabel)))                     { ret =       ((MyEqLabel)obj_1).isEqualTo(indent, obj_2); }
                else if (t.Equals(typeof(MyEqRow)))                       { ret =         ((MyEqRow)obj_1).isEqualTo(indent, obj_2); }
                else if (t.Equals(typeof(MyCell)))                        { ret =          ((MyCell)obj_1).isEqualTo(indent, obj_2); }
                else if (t.Equals(typeof(MySection)))                     { ret =       ((MySection)obj_1).isEqualTo(indent, obj_2); }
                #endif //__MyEQE__
            	else
                {
                    MyDebug.DoAssert(false, "fixme: shouldn't call this with null arg: " + t.ToString());
                }
            }
            catch(Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "fixme: shouldn't call this with null arg:  " + obj_1.GetType().ToString());
            }
            return ret;
        }

        #if __XAMARIN__
        public static Xamarin.Forms.View GetPhysicalView(MyView_Stk obj, int where_from)
        {
            return obj._myScrollView;
        #elif __WINFORMS__
        public static System.Windows.Forms.Control GetPhysicalView(MyView_Stk obj, int where_from)
        {
            return obj._theVIEW;
        #elif __MAC__
        public static AppKit.NSView GetPhysicalView(MyView_Stk obj, int where_from)
        {
            return obj._myScrollView;
        #endif
        }

        public static void SetFontScaler(string indent, object obj, float scaler)
        {
            if (     obj is MyStack) ((MyStack)obj).SetChildren_FontScaler(      indent, scaler);
            else if (obj is MyNode)   ((MyNode)obj)._myFontDef.setFontSizeScaler(indent+" "+Dynamics.NamedPtr(obj), scaler);
            else MyDebug.DoAssert(false, "fixme: must handle all types here: " + obj.GetType().ToString());
        }

        public static bool is_MyBase_Type(object obj) 
        {
            if(obj != null)
            {
                if(obj is MyBase) return true;

            //    // this kludge is needed because MAC doesn't support dynamic typing
            //    // this kludge is needed because MAC doesn't support dynamic typing
            //
            //    // this is a kludge way of discovering the base class 
            //    // if the cast fails, it will throw, we catch and handle it as a true/false event
            //    // 
            //    // currently only checking the 2 main ones. shouldn't need a long list here
            //    Type t = obj.GetType();
            //	if  (t.Equals(typeof(MyNode)))              { return true; }   // speeds up on __WINFORMS__
            //    try
            //    {
            //        //MyDebug.DPrint(Global.sprintf("Check base type {0}     typ: {1}", Tools.NamedPtr(obj), type));
            //        MyBase    o =  (MyBase)obj;
            //        return true; 
            //    }
            //    catch//(Exception e) // this will generate an unused warning if it's here
            //    {
            //        // should drop down and return false on a catch
            //        //MyDebug.DPrint(Global.sprintf("cast failed:::::::::::::::::  {0}     typ: {1}", Tools.NamedPtr(obj), type));
            //    }
            }
            return false;
        }
        public static bool is_MyView_Stk_Type(  object obj)
        {
            try{  MyView_Stk o = (MyView_Stk)obj;  return true; }
            catch { } // drop through and return false. This is a very rare code example of an exception that's not fatal
            return false;
        }
        public static bool is_MyDialogBase_Type(object obj)
        {
            try{  MyDialogBase o = (MyDialogBase)obj;  return true; }
            catch { } // drop through and return false. This is a very rare code example of an exception that's not fatal
            return false;
        }
        public static bool is_MyStack_Type(object obj)
        {
            if(obj != null)
            {
                Type t = obj.GetType();
                // move these to the "user aProj" area
                if(  t.Equals(typeof(MyDialog_Image))
                  || t.Equals(typeof(MyDialog_Template))
                  || t.Equals(typeof(MyToolTip))
                  || t.Equals(typeof(MyMsgBox))
                #if __MyEQE__
                  || t.Equals(typeof(MyCell))
                  || t.Equals(typeof(MyTable))
                  || t.Equals(typeof(MyEqRow))
                  || t.Equals(typeof(MyEqLabel))
                #endif //__MyEQE__
                  ) { return true; }   // speeds up on __WINFORMS__

                if(  t.Equals(typeof(MyTextField))
                  || t.Equals(typeof(MyStack))
                  || t.Equals(typeof(MyLabel))
                  || t.Equals(typeof(MyButton))
                  || t.Equals(typeof(MyKey))
                  || t.Equals(typeof(MyMenuItem))
                  || t.Equals(typeof(MyView_Stk))
                  || t.Equals(typeof(MyKeyboard)) // also MyView_Stk
                  || t.Equals(typeof(MyPage))     // also MyView_Stk
                  ) { return true; }   // speeds up on __WINFORMS__
                //try { MyStack o = (MyStack)obj; return true; }
                //catch { } // drop through and return false. This is a very rare code example of an exception that's not fatal
            }
            return false;
        }

        public static bool IsCapital(string indent, object obj)
        {
            if(obj == null) return false;
            Type t = obj.GetType();
            bool ret = false;
            try
            {
                if(obj is MyNode)           { ret = IsCapital(((MyNode)obj).MyUChar); }
                //else if(t.Equals(typeof(MyNode_Frac)))      { ret = false;  }
            }
            catch (Exception e)
            {
                Global.DumpException(e);
                MyDebug.DoAssert(false, "fix IsCapital for: " + t.ToString());
            }
            return ret;
        }
        public static bool IsCapital(string str)
        {
            switch(str[0])
            {
                case 'A': case 'B': case 'C': case 'D': case 'E': case 'F': case 'G': case 'H': case 'I': 
                case 'J': case 'K': case 'L': case 'M': case 'N': case 'O': case 'P': case 'Q': case 'R': 
                case 'S': case 'T': case 'U': case 'V': case 'W': case 'X': case 'Y': case 'Z': return true;
            }
            return false;
        }
        public static bool IsLower(string str)
        {
            switch(str[0])
            {
                case 'a': case 'b': case 'c': case 'd': case 'e': case 'f': case 'g': case 'h': case 'i': 
                case 'j': case 'k': case 'l': case 'm': case 'n': case 'o': case 'p': case 'q': case 'r': 
                case 's': case 't': case 'u': case 'v': case 'w': case 'x': case 'y': case 'z': return true;
            }
            return false;
        }
    }
}
