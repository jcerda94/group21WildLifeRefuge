using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.IO;

namespace DebugStuff
{
    public class Global
    {
        public static string GetDumpBytes(byte[] bytes)
        {
            StringBuilder sb = new StringBuilder("Bytes");
            sb.AppendFormat("[{0}]: ", bytes.Length);
            sb.Append("{");
            for (int i = 0; i < bytes.Length; i++) sb.AppendFormat("{0}{1}", bytes[i], (i < (bytes.Length-1))?",":"");
            sb.Append("}");
            return sb.ToString();
        }
        public static string Glyph2Str(ushort[] glyph)
        {
            string txt = "";
            for(int i = 0; i < glyph.Length; i++)
            {
                txt += ((char)glyph[i]).ToString();
            }
            //txt += "\0";
            return txt;
        }
        public static ushort[] Str2Glyph(string txt)
        {
            ushort[] glyph = new ushort[txt.Length];
            for(int i = 0; i < glyph.Length; i++)
            {
                glyph[i] = (ushort)(txt[i]);
            }
            //txt += "\0";
            return glyph;
        }
        //public static string FormatRectStr(double x, double y, double w, double h, double r=0) { return FormatRectStr((int)x, (int)y, (int)w, (int)h, (int)r); }
        //public static string FormatRectStr(int x, int y, int w, int h, int r=0) { return sprintf(" x:y {0,3}:{1,-3}   w:h {2,3}:{3,-3}  r: {4}", x, y, w, h, r); }
        //public static string FormatRectStr(int x, int y, int w, int h) { return sprintf(" x:y {0,3}:{1,-3} w:h {2,3}:{3,-3}  r: {4}", x, y, w, h, r); }
        public static string FormatRectStr(double x, double y, double w, double h, int r) { return FormatRectStr((int)x, (int)y, (int)w, (int)h, r); }
        public static string FormatRectStr(int x, int y, int w, int h, int r) { return sprintf(" x:y {0,3}:{1,-3} w:h {2,3}:{3,-3} {4}", x, y, w, h, (r!=0)?"r: "+r.ToString():""); }

        public static string AddLeading_(int num) { return AddLeading_("", num); }
        public static string AddLeading_(string prefix, int num)
        {
            if((0 <= num) && (num < 0x10))         return Global.sprintf("{0}____{1:x}", prefix, num);
            if(               num < 0x100)         return Global.sprintf( "{0}___{1:x}", prefix, num);
            if(               num < 0x1000)        return Global.sprintf(  "{0}__{1:x}", prefix, num);
            if(               num < 0x10000)       return Global.sprintf(   "{0}_{1:x}", prefix, num);
            return "--" + num;
        }

        //public static bool TypeHasChildren(object obj)
        //{
        //    bool ret = false;
        //    if(Dynamics.is_MyBase_Type(obj)) ret = true;
        //    else if(obj.GetType().Equals(typeof(MyPhysicalView))) ret = true;
        //    else if(obj.GetType().Equals(typeof(MyPhysViewWrapper))) ret = true;
        //    //else if( obj.GetType().Equals(typeof(MyScrollWrapper))) ret = true;
        //    return ret;
        //}
        // this one is recursive
        //public static void GetBaseLocation(string indent, object obj, ref double X, ref double Y)
        //{
        //    object local_obj = obj;
        //    indent += "    ";
        //    if (local_obj != null)
        //    {
        //        Type t = local_obj.GetType();
        //        MyDebug.DPrint(Global.sprintf("{0}{1}: -------------------------- ", indent, t));
        //        try
        //        {
        //            //fixme:
        //            //if (t.Equals(typeof(EqRow)))
        //            //{
        //            //    EqRow mg = (EqRow)local_obj;
        //            //    //MyDebug.DPrint(Global.sprintf("{0}EqRow  Child Cnt: {1}     X:Y {2}:{3}", indent, mg.Children.Count, mg.X, mg.Y));
        //            //    X += ((EqRow)local_obj).X;
        //            //    Y += ((EqRow)local_obj).Y;
        //            //    GetBaseLocation(((EqRow)local_obj).Parent, ref indent, ref X, ref Y);
        //            //    return;
        //            //}
        //            //// these are all 'MyGrid' based
        //            //else if (t.Equals(typeof(EqE_App.Node_SqRoot))
        //            //      || t.Equals(typeof(Node_Grid)))
        //            //{
        //            //    MyGrid mg = (MyGrid)local_obj;
        //            //    //MyDebug.DPrint(Global.sprintf("{0}MyGrid with Name {1}  and Child Cnt: {2}     r/c {3}/{4}    X:Y {5}:{6}", indent, mg.MyName, mg.Children.Count, mg.getRows(), mg.getCols(), mg.X, mg.Y));
        //            //    X += ((MyGrid)local_obj).X;
        //            //    Y += ((MyGrid)local_obj).Y;
        //            //    GetBaseLocation(((MyGrid)local_obj).Parent, ref indent, ref X, ref Y);
        //            //    return;
        //            //}
        //            //else if (t.Equals(typeof(SingleEqForm)))
        //            //{
        //            //    MyGrid mg = (MyGrid)local_obj;
        //            //    //MyDebug.DPrint(Global.sprintf("{0}MyGrid with Name {1}  and Child Cnt: {2}     r/c {3}/{4}    X:Y {5}:{6}", indent, mg.MyName, mg.Children.Count, mg.getRows(), mg.getCols(), mg.X, mg.Y));
        //            //    X += ((MyGrid)local_obj).X;
        //            //    Y += ((MyGrid)local_obj).Y;
        //            //    GetBaseLocation(((MyGrid)local_obj).Parent, ref indent, ref X, ref Y);
        //            //    return;
        //            //}
        //            //else if (t.Equals(typeof(MyLabel)))
        //            //{
        //            //    //MyDebug.DPrint(Global.sprintf("{0}Label with Name: {1}  Text: '{2}'     X:Y {3}:{4}", indent, ((MyLabel)local_obj).MyName, ((MyLabel)local_obj).Text, ((MyLabel)local_obj).X, ((MyLabel)local_obj).Y));
        //            //    X += ((MyLabel)local_obj).X;
        //            //    Y += ((MyLabel)local_obj).Y;
        //            //    GetBaseLocation(((MyLabel)local_obj).Parent, ref indent, ref X, ref Y);
        //            //    return;
        //            //}
        //            //else if (!t.Equals(typeof(Xamarin.Forms.StackLayout))) // this is top level, so ok to be done here
        //            //{
        //            //    MyDebug.DoAssert(false, "Fix to handle ALL types of classes above");
        //            //}
        //        }
        //        catch (Exception e)
        //        {
        //            MyDebug.DPrint(Global.sprintf(indent + "Please fix to handle ALL types of classes above:  {0}", t));
        //            Global.DumpException(e);
        //            MyDebug.DoAssert(false, indent + "Please fix to handle ALL types of classes above");
        //        }
        //    }
        //    MyDebug.DPrint(Global.sprintf("{0}Return:   X:Y {1:0.0}:{2:0.0}  ", indent, X, Y));
        //}
        //
        public static void DumpException_no_Assert(Exception e,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            int start_idx = sourceFilePath.LastIndexOf("\\");
            int str_length = sourceFilePath.Length;

            string indent_str = "        ";
            //if (indent_reducer != 0)
            //    indent_str = "    ";

            //Debug.WriteLine(Global.sprintf("{0,20}({2,4}) {1,22}:{3}" + s, sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str));
            string str = Global.sprintf("{0,20}({2,4}) {1,22}:{3}", sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str);
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  {1}: Message: {2}", str, e.HResult, e.Message));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception   Source: {1}"                                                 , str, ((e != null) ? e.Source : "Null")));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception    Stack: \n   {1}"                                            , str, ((e != null) ? e.StackTrace : "Null")));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            if (e != null)
            {
                MyDebug.DPrint_Force(Global.sprintf("{0}    Exception    Inner: {1}", str, e.InnerException));
                MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
                //Debug.WriteLine(Global.sprintf("{0}    Exception   Target: {1}", str, e.TargetSite));
            }
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            MyDebug.DPrint_Force(Global.sprintf("{0}    Exception  ===========================================================  ", str));

            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            Debug.WriteLine(Global.sprintf("{0}    Exception  {1}: Message: {2}", str, e.HResult, e.Message));
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            Debug.WriteLine(Global.sprintf("{0}    Exception   Source: {1}"                                                 , str, ((e != null) ? e.Source : "Null")));
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            Debug.WriteLine(Global.sprintf("{0}    Exception    Stack: \n   {1}"                                            , str, ((e != null) ? e.StackTrace : "Null")));
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            if (e != null)
            {
                Debug.WriteLine(Global.sprintf("{0}    Exception    Inner: {1}", str, e.InnerException));
                Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
                //Debug.WriteLine(Global.sprintf("{0}    Exception   Target: {1}", str, e.TargetSite));
            }
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
            Debug.WriteLine(Global.sprintf("{0}    Exception  ===========================================================  ", str));
        }

        public static void DumpException(Exception e,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            DumpException_no_Assert(e, memberName, sourceFilePath, sourceLineNumber);
            MyDebug.DoAssert(false, "***************************** fail ALL excpetions ******************************");
        }

        //public static void DumpXmlException(string xml, XmlException xExp)
        //{
        //    MyDebug.DPrint(Global.sprintf(" xml: {0}", xml));
        //    MyDebug.DPrint(Global.sprintf("      123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"));
        //    MyDebug.DPrint(Global.sprintf("               111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999000000000011111111112222222222333333333344444444445555555555666666666677777777778888888888999999999900000000001111111111222222222233333333334444444444555555555566666666667777777777888888888899999999990000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999000000000011111111112222222222333333333344444444445555555555666666666677777777778888888888999999999900000000001111111111222222222233333333334444444444555555555566666666667777777777888888888899999999990"));
        //    MyDebug.DPrint(Global.sprintf("                                                                                                         111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111122222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222223333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333344444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444445"));

        //    MyDebug.DPrint(Global.sprintf("xml exp: InnerException: {0}", xExp.InnerException));
        //    MyDebug.DPrint(Global.sprintf("xml exp:        Message: {0}", xExp.Message));
        //}

        public static string sprintf(string str, params object[] args)
        {
            // Goal is to ensure that ill-formed MyDebug.DPrint calls don't throw and thereby change the code flow.
            // Goal is to ensure that ill-formed MyDebug.DPrint calls don't throw and thereby change the code flow.
            // Goal is to ensure that ill-formed MyDebug.DPrint calls don't throw and thereby change the code flow.
            // Goal is to ensure that ill-formed MyDebug.DPrint calls don't throw and thereby change the code flow.

            // basically this function wraps the "Global.sprintf" function in a try/catch to avoid throws out of the actual code.
            try
            {
                string formatted_str = String.Format(str, args);
                return formatted_str;
            }
            catch (Exception e)
            {
                Debug.WriteLine(" sprintf  Exception  ======'" + str + "'======");
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception  HResult: " + e.HResult);
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception  Message: " + e.Message );
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception   Source: " + e.Source);
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception    Stack: " + e.StackTrace);
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception    Inner: " + e.InnerException);
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                //Debug.WriteLine(" sprintf  Exception   Target: " + e.TargetSite);
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
                Debug.WriteLine(" sprintf  Exception  ===========================================================  ");
            }

            return str; // return original str if there was any error.
        }

        public static bool isNumber(char c)
        {
            if(('0' <= c) && (c <= '9'))
            {
                return true;
            }
            return false;
        }

        public static string IncStr(string s)
        {
            //fixme to grow string to additional char
            char []c = s.ToCharArray();
            // increment the end

            int int_length = 0;
            int cnt = s.Length;
            while(cnt-- != 0)
            {
                if (isNumber(c[cnt]))
                {
                    int_length++;
                }
            }
            // s = A1    int_length = 1     s.Length - int_length   2 - 1 = 1      A
            // s = BA1   int_length = 1     s.Length - int_length   3 - 1 = 2      BA
            // s = BA12  int_length = 1     s.Length - int_length   4 - 2 = 2      BA
            if(int_length != 0)
            {
                string non_int_part = s.Remove(   s.Length - int_length);
                string s_to_convert = s.Remove(0, s.Length - int_length);
                int n = Convert.ToInt32(s_to_convert);
                n++;
                return non_int_part + n.ToString();
            }

            //if((c[c.Length - 1] >= '0')
            //  && (c[c.Length - 1] <= '9'))
            //{
            //    int n = Convert.ToInt32(s);
            //    n++;
            //    return n.ToString();
            //}
            //else
            {
                if((c[c.Length - 1] == 'z')
                 ||(c[c.Length - 1] == 'Z'))
                {
                    char start;
                    char end = c[c.Length - 1];
                    if(end == 'z') { start = 'a'; }
                    else           { start = 'A'; }
                    c[c.Length - 1] = start;  // either A or a

                    if(c.Length > 1)
                    {
                        if((c[c.Length - 2] == 'z')
                         ||(c[c.Length - 2] == 'Z'))
                        {
                            c[c.Length - 2] = start;
                        }
                        else c[c.Length - 2]++;
                    }
                    if(c.Length > 2)
                    {
                        if((c[c.Length - 3] == 'z')
                         ||(c[c.Length - 3] == 'Z'))
                        {
                            c[c.Length - 3] = start;
                        }
                        else c[c.Length - 3]++;
                    }
                }
                else c[c.Length - 1]++;
            }
            return new string(c);
        }

        public static string ResetLabelStr(string s)
        {
            //fixme to grow string to additional char
            char []c = s.ToCharArray();
            // increment the end

            int int_length = 0;
            int cnt = s.Length;
            while(cnt-- != 0)
            {
                if (isNumber(c[cnt]))
                {
                    int_length++;
                }
            }
            // s = A1    int_length = 1     s.Length - int_length   2 - 1 = 1      A
            // s = BA1   int_length = 1     s.Length - int_length   3 - 1 = 2      BA
            // s = BA12  int_length = 1     s.Length - int_length   4 - 2 = 2      BA
            if(int_length != 0)
            {
                string non_int_part = s.Remove(   s.Length - int_length);
                string s_to_convert = s.Remove(0, s.Length - int_length);
                int n = Convert.ToInt32(s_to_convert);
                n++;
                return non_int_part + "1";
            }
            return s + "1";
        }

        public static string IncLetter(string s)
        {
            //fixme to grow string to additional char
            char []c = s.ToCharArray();
            // increment the end

            if((c[c.Length - 1] == 'z')
             || (c[c.Length - 1] == 'Z'))
            {
                char start;
                char end = c[c.Length - 1];
                if(end == 'z') { start = 'a'; }
                else           { start = 'A'; }
                c[c.Length - 1] = start;  // either A or a

                if(c.Length > 1)
                {
                    if((c[c.Length - 2] == 'z')
                     || (c[c.Length - 2] == 'Z'))
                    {
                        c[c.Length - 2] = start;
                    }
                    else c[c.Length - 2]++;
                }
                if(c.Length > 2)
                {
                    if((c[c.Length - 3] == 'z')
                     || (c[c.Length - 3] == 'Z'))
                    {
                        c[c.Length - 3] = start;
                    }
                    else c[c.Length - 3]++;
                }
            }
            else c[c.Length - 1]++;
               
            return new string(c);
        }


        private const int   kNumTimeStamps = 1000;
        public static Stopwatch stopWatch = new Stopwatch();
        public static long _lastTimeStamp;
        public static string TimeStampMillis
        {
            get
            {
                if(!stopWatch.IsRunning) stopWatch.Start();
                string str;
                long cur_millis = stopWatch.ElapsedMilliseconds;
                str = "Elasped(millisec): " + (cur_millis - _lastTimeStamp).ToString();
                _lastTimeStamp = cur_millis;
                return str;
            }
        }
        //private static TimeSpan CurrentTime;
        private static TimeSpan[] LastTimeStamp = new TimeSpan[kNumTimeStamps];


        public static float DensityFactor = 2.0f;
        private static string _MyInternalClipboardStr;
        public static string MyInternalClipboardStr
        {
            get { return _MyInternalClipboardStr; }
            set
            {
                MyDebug.DPrint(Global.sprintf("load: '{0}'", value));
                _MyInternalClipboardStr = value;
            }
        }
        public static bool State_Replace_WaitingForReplacement
        {
            get { return _State_Replace_WaitingForReplacement; }
            set
            {
                MyDebug.DPrint("set to " + value);
                _State_Replace_WaitingForReplacement = value;
            }
        }
        public static bool _State_Replace_WaitingForReplacement = false;

        public static string Org_ProblemStatement_Text;

        public static bool _HighlightTracking_Enabled = false;
        public static bool _TrackInsteadOfDeletion = true;
        public static int kNumberOfTypes = 4;

        public static bool Initialized = false;
    }

    public class MyMessageBox
    {
        public static void Show(string s,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            int start_idx = sourceFilePath.LastIndexOf("\\");
            int str_length = sourceFilePath.Length;
            string indent_str = "        ";
            string calledFrom = Global.sprintf("{0,20}({2,4}) {1,22}:{3}", sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str);

            string msg = s;
            MyDebug.DPrint(Global.sprintf("{0}:    msg: '{1}'", calledFrom, msg));
        }
    }
}
