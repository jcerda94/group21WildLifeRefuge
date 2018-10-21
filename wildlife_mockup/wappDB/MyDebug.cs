using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using System.Threading;
//
// usage:
//
//      MyDebug.DPrint(MyDebug.sprintf("some statement with args {0} and {1}", arg1, arg2));
//
// output: 
//         filename.cs( line )                      method:         formated string
// --------------------------------------------------------------------------------------------------------------------------
// [0:] SimpleCoreTextView.cs( 178)                   Draw:         here
// [0:] SimpleCoreTextView.cs( 135)   DrawRangeAsSelection:         selectionRange: loc:len 2:0
// [0:] SimpleCoreTextView.cs( 135)   DrawRangeAsSelection:         selectionRange: loc:len 2147483647:0
// [0:] IndexedRange.cs(  54)                     GetRange:         here
// [0:] IndexedRange.cs(  54)                     GetRange:         here
// [0:] IndexedPosition.cs(  43)               GetPosition:         [2] result: <SimpleTextInput_IndexedPosition: 0x7a6109a0> 
// [0:] IndexedPosition.cs(  43)               GetPosition:         [0] result: <SimpleTextInput_IndexedPosition: 0x7a93d690> 
// [0:] IndexedRange.cs(  54)                     GetRange:         here
// [0:] SimpleCoreTextView.cs( 263)              FirstRect:         here
// [0:] IndexedPosition.cs(  43)               GetPosition:         [2] result: <SimpleTextInput_IndexedPosition: 0x7a6109a0> 
// 
// 

// https://developer.android.com/studio/profile/generate-trace-logs.html

namespace DebugStuff
{
    public static class SysConst
    {
        public const char kSeparator = '\\';
    }

    public class MyDebug
    {
        //public static bool OutputRealTime = true;
        public static bool OutputRealTime = false; 

        //private static bool Allow_Global_Debug_Disable = false;
        private static bool Allow_Global_Debug_Disable = true;
        public static string DebugTraceFilename;
        //#if __XAMARIN__
        //    #if __ANDROID__
        //        public static string DebugTraceFilename = "XAM_Debug_Trace";   // date/time/.log will be appended to these
        //    #else
        //        public static string DebugTraceFilename = "iOS_Debug_Trace";
        //    #endif
        //#elif __WINFORMS__
        //    public static string DebugTraceFilename = "WIN_Debug_Trace";
        //#elif __MAC__
        //    public static string DebugTraceFilename = "MAC_Debug_Trace";
        //#endif

        public static string DebugTraceFullPathname = "empty";
        
        //#if !__CHROME__
        public static System.IO.StreamWriter MyDebugFile;
        //#endif
        private static bool SetupOnce = false;

        private static string indent_str = " ";
        //private static string debug_layout_3_args = "{0,36}({2,4}) {1,22}";
        //private static string debug_layout_4_args = "{0,8}{1,36}({3,4}) {2,22}";
        private static string debug_layout_4_args = "{0,8}{1,20}({3,4}) {2,22}";
        public static string debug_Final_layout = "{0}:{1}  {2}";
        private static int ThreadNum = 1;
        private static bool useForce = false;
        public static void DPrint_Force(
            string s,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            //bool debug_state = _DebugDPrints_Enabled;
            //_DebugDPrints_Enabled = true;
            useForce = true;
            DPrint(s, memberName, sourceFilePath, sourceLineNumber, true);
            //_DebugDPrints_Enabled = debug_state;
            useForce = false;
        }
        public static void DPrint_Output(
            string s,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            //bool debug_state = _DebugDPrints_Enabled;
            //_DebugDPrints_Enabled = true;
            useForce = true;
            DPrint(s, memberName, sourceFilePath, sourceLineNumber);
            Debug.WriteLine(s);
            useForce = false;
            //_DebugDPrints_Enabled = debug_state;
        }
        private static string GetProcIndent()
        {
            return "";


            //string ret = "";
            //switch (APP.whichProcess)
            //{
            //    case eProcess.NA:           ret = " -----NA-:"; break;
            //    case eProcess.DrawIt:       ret = "   DrawIt:"; break;
            //    case eProcess.OnTouch:      ret = "    Touch:"; break;
            //    case eProcess.TimerStartup: ret = "  TimerSt:"; break;
            //    case eProcess.TimerTick:    ret = "     Tick:"; break;
            //    case eProcess.HttpThread:   ret = " HttpThrd:"; break;
            //    case eProcess.OnKeyDown:    ret = "      Key:"; break;
            //}
            //ret += indent_str;
            //return ret;
        }

        public static int TaskPauseIndent = 0;
        public static bool Allow_DebugCalcs = true;
        //public static bool Debug_Calculations = false;
        //public static string LastThreadNamePrinted;
        public static string LastContextPrinted = "first";
        public static string MainContextName;
        private static int dprintCnt;
        //public static MyQueue<string> myDebugQueue = new MyQueue<string>();
        
        //https://stackoverflow.com/questions/18932851/c-sharp-writing-to-text-file-safely-with-heaps-of-threads
        private static object _sbSync = new Object();
        public static void AppendLine(string line)
        {
            #if __MAC__
                MyDebugFile.WriteLine(line);
                //MyDebugFile.Flush();
            #else
            lock (_sbSync)
            {
                MyDebugFile.WriteLine(line);
                MyDebugFile.Flush();
            }
            #endif
        }

        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        //public static void DPrint_Stack(
        //    string s,
        //    [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
        //    [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
        //    [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        //{
        //    if (!APP.PerformanceMode)
        //    {
        //        StackTrace st = new StackTrace(true);
        //        int stackDepth = st.FrameCount - 11;
        //
        //        string from = "from: ";
        //        string from_name;
        //        int from_line;
        //        for (int i = 0; i < stackDepth; i++)
        //        {
        //            StackFrame sf = st.GetFrame(stackDepth - i);
        //            from_name = sf.GetMethod().ToString();
        //            from_name = from_name.Remove(from_name.IndexOf("("));
        //            from_name = from_name.Remove(0, from_name.IndexOf(" "));
        //            from_line = sf.GetFileLineNumber();
        //
        //            from = Global.sprintf("{0} >>{1}({2})", from, from_name, from_line);
        //        }
        //        s = Global.sprintf("{0, -110}  {1}", s, from);
        //    }
        //    DPrint_Force(s, memberName, sourceFilePath, sourceLineNumber);
        //}
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        // Warning: Use this sparingly. While powerfull, "new StackTrace" will slow down the app considerably if used a lot.
        public static void DPrint_whereFrom(
            string s,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            //if (!APP.PerformanceMode && (APP.Debug_whereFrom_deepStack || APP.Debug_whereFrom))
            //{
            //    if (APP.Debug_whereFrom_deepStack)
            //    {
            //        StackTrace st = new StackTrace(true);
            //        if (st.FrameCount >= 6)
            //        {
            //            string[] from_name = new string[5];
            //            int[] from_line = new int[5];
            //            for (int i = 0; i < 5; i++)
            //            {
            //                StackFrame sf = st.GetFrame(6 - i);
            //                from_name[i] = sf.GetMethod().ToString();
            //                from_name[i] = from_name[i].Remove(from_name[i].IndexOf("("));
            //                from_name[i] = from_name[i].Remove(0, from_name[i].IndexOf(" "));
            //                from_line[i] = sf.GetFileLineNumber();
            //            }
            //            string from = Global.sprintf("whereFrom: {0}({1}) >>{2}({3}) >>{4}({5}) >>{6}({7}) >>{8}({9})"
            //                , from_name[0], from_line[0]
            //                , from_name[1], from_line[1]
            //                , from_name[2], from_line[2]
            //                , from_name[3], from_line[3]
            //                , from_name[4], from_line[4]);
            //
            //            s = Global.sprintf("{0, -110}  {1}", s, from);
            //        }
            //    }
            //    else
            //    {
                    StackTrace st = new StackTrace(true);
                    if (st.FrameCount >= 4)
                    {
                        string[] from_name = new string[3];
                        int[] from_line = new int[3];
                        for (int i = 0; i < 3; i++)
                        {
                            StackFrame sf = st.GetFrame(4 - i);
                            from_name[i] = sf.GetMethod().ToString();
                            from_name[i] = from_name[i].Remove(from_name[i].IndexOf("("));
                            from_name[i] = from_name[i].Remove(0, from_name[i].IndexOf(" "));
                            from_line[i] = sf.GetFileLineNumber();
                        }
                        string from = Global.sprintf("whereFrom: {0}({1}) >>{2}({3}) >>{4}({5})"
                            , from_name[0], from_line[0]
                            , from_name[1], from_line[1]
                            , from_name[2], from_line[2]);
                    
                        s = Global.sprintf("{0, -110}  {1}", s, from);
                    }
            //    }
            //}
            DPrint_Force(s, memberName, sourceFilePath, sourceLineNumber);
        }

        public static void VerifyMainThread(string indent)
        {
            if((Thread.CurrentThread.Name != null)
             &&(MyDebug.MainContextName != null))
            {
                if(Thread.CurrentThread.Name != MyDebug.MainContextName)
                {
                    string err = Global.sprintf("Wrong thread: should be: {0}     is: {1}", MyDebug.MainContextName, Thread.CurrentThread.Name);
                    MyDebug.DPrint_whereFrom(err);
                    Debug.WriteLine(err);
                    MyDebug.DoAssert(false, err);
                }
            }
        }

        public static void DPrint(
            string s,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0,
            bool myUseForce = false)
        {
            // StackTrace does work but is very, very slow and impacts performance significantly
            // StackTrace does work but is very, very slow and impacts performance significantly
            // StackTrace does work but is very, very slow and impacts performance significantly
            //
            // use these instead. Very fast.
            //            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            //            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            //            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
            //
            // can use StackTrace to get caller stack to see how we got to this DPrint()
            //
            //StackTrace st = new StackTrace(true);
            //
            //    // Note that at this level, there are four
            //    // stack frames, one for each method invocation.
            //    StackFrame sf = st.GetFrame(2);
            //    string method = sf.GetMethod().ToString();
            //    method = method.Remove(method.IndexOf("("));
            //    //Console.WriteLine(" Method: {0}({1})", method, sf.GetFileLineNumber() );
            //    //Console.WriteLine(  stackIndent + " File: {0}", sf.GetFileName());
            //    //Console.WriteLine(  stackIndent + " Line Number: {0}", );
            //    //stackIndent += "  ";
            //string memberName = method;
            //string sourceFilePath = sf.GetFileName();
            //int sourceLineNumber = sf.GetFileLineNumber();


            MyDebug_setup();

            if (!myUseForce)
            {
                if (Allow_Global_Debug_Disable)
                    if (!IsDebugDPrintsEnabled()) return;
                //if (!IsDebugDPrintsEnabled() && !useForce) return;
            }
            //if(APP.FreeRunClk == null) return; 

            string proc_indent = GetProcIndent();
            //proc_indent += indent_str; 
            string str = Global.sprintf(debug_Final_layout, FormatFileLineInfo(memberName, sourceFilePath, sourceLineNumber, proc_indent), indent_str, s);

            // debug threading info
            // debug threading info
            // debug threading info
            //
            string thread_str = "";
            if ((Thread.CurrentThread.Name == null) 
               // || (LastContextPrinted=="first")
               // || (LastContextPrinted == "Threadpool worker") // MAC
                ) 
            {
                thread_str = Global.AddLeading_(ThreadNum++);
                Thread.CurrentThread.Name = thread_str;
                //if(MainContextName == null) MainContextName = thread_str;
            }
            else
            {
                thread_str = Thread.CurrentThread.Name;
            }
            //if (APP.ShowThreadInfo)
            //{
            //    int id = (System.Threading.Tasks.Task.CurrentId == null)?0:(int)System.Threading.Tasks.Task.CurrentId;
            //    string task_str = Global.AddLeading_(id);
            //    
            //    string context_str = Global.sprintf("Th{0}[{1,4:d}]", thread_str, id);
            //    //string time = APP.FreeRunClk.CurrentRunTime_str();
            //    //if (LastContextPrinted != context_str) { str = Global.sprintf("{0}  {1}  {2}:{3} {4}", time, dprintCnt, context_str, LastContextPrinted, str); }
            //    //else                                   { str = Global.sprintf("{0}  {1}  {2}:              {3}", time, dprintCnt, context_str, str); }
            //    if (LastContextPrinted != context_str) { str = Global.sprintf("{0}  {1}:{2} {3}", dprintCnt, context_str, LastContextPrinted, str); }
            //    else                                   { str = Global.sprintf("{0}  {1}:              {2}", dprintCnt, context_str, str); }
            //    LastContextPrinted = context_str;
            //}
            ////#if __XAMARIN__
            //str = Global.sprintf("{0}  {1}", time, str);  
            //#endif 
            // debug threading info
            // debug threading info
            // debug threading info



            str = Global.sprintf("{0}: {1}", dprintCnt, str);  
            dprintCnt++;


            try
            {
                if (OutputRealTime)
                    Debug.WriteLine(str);

                if (MyDebugFile != null)
                {
                    //if (Thread.CurrentThread.Name != MainContextName)
                    //{
                    //    myDebugQueue.Add(str);
                    //}
                    //else
                    //{
                    //    while(myDebugQueue.Count != 0)
                    //    {
                    //        MyDebugFile.WriteLine(myDebugQueue.Dequeue());
                    //    }
                        //MyAsyncHelper.RunSync(() => MyDebugFile.WriteLineAsync(str));
                        AppendLine(str);
                    //}
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine(Global.sprintf("***File Access Error   writing: '" + e.Message + "'"));
                Global.DumpException(e);
            }
        }
        public static string GetMemberName(
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)   {   return memberName; }
        public static string GetMemberName_ForIndent(
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)   {   return memberName + ": "; }
        public static string GetSourceFilePath(
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)   {   return sourceFilePath; }
        public static int GetSourceLineNumber(
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)   {   return sourceLineNumber; }

        public static void DoAssert(bool assert_true, string err,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            if(!assert_true)
            {
                err = "DoAssert Failed:   " + err;
                DPrint_Force(err, memberName, sourceFilePath, sourceLineNumber);
                string from = "";
                StackTrace st = new StackTrace(true);
                if (st.FrameCount >= 6)
                {
                    string[] from_name = new string[5];
                    int[] from_line = new int[5];
                    for (int i = 0; i < 5; i++)
                    {
                        StackFrame sf = st.GetFrame(6 - i);
                        from_name[i] = sf.GetMethod().ToString();
                        from_name[i] = from_name[i].Remove(from_name[i].IndexOf("("));
                        from_name[i] = from_name[i].Remove(0, from_name[i].IndexOf(" "));
                        from_line[i] = sf.GetFileLineNumber();
                    }
                    from = Global.sprintf("whereFrom: {0}({1}) >>{2}({3}) >>{4}({5}) >>{6}({7}) >>{8}({9})"
                        , from_name[0], from_line[0]
                        , from_name[1], from_line[1]
                        , from_name[2], from_line[2]
                        , from_name[3], from_line[3]
                        , from_name[4], from_line[4]);

                    err = Global.sprintf("{0, -110}  {1}", err, from);
                }
                DPrint_Force(err, memberName, sourceFilePath, sourceLineNumber);
                DPrint_Force(from);

                #if __IOS__
                TMA_Cloud.xCloud.SendDebugFile("from Assert: ");
                #endif 
                

                throw new Exception(err);



                //Debug.WriteLine("Close MyDebugFile");
                //
                //#if !__XAMARIN__ && !__MAC__
                //APP.myTimer.Stop();
                //APP.myStartupTimer.Stop();
                //#endif 
                // 
                ////#if !__CHROME__
                //if(MyDebugFile != null)
                //{
                //    MyDebugFile.Flush();
                //    //MyDebugFile.Close();
                //}
                ////#endif
                ////MyTraceFlushToFile();
                //Debug.WriteLine("                              Call assert false");
                //Debug.WriteLine("                              Call assert false");
                //Debug.WriteLine("                              Call assert false");
                //Debug.WriteLine("                              Call assert false");
                //Debug.WriteLine("                              Call assert false");
                ////Debug.Assert(false, err);                throw (new Exception("DoAssert Failed"));
                //#if __WINFORMS__
                //APP._myMainWindow.Close();
                //#endif
            }
        }

        public static void FlushDebugTrace(string indent)
        {
            Debug.WriteLine("Close MyDebugFile");

            //#if !__XAMARIN__ && !__MAC__
            //APP.myTimer.Stop();
            //APP.myStartupTimer.Stop();
            //#endif 
             
            if(MyDebugFile != null)
            {
                MyDebugFile.Flush();
            }
            Debug.WriteLine("Close App");
            Debug.WriteLine("Close App");
            Debug.WriteLine("Close App");
        }

        public static string FormatFileLineInfo(
              string memberName
            , string sourceFilePath
            , int sourceLineNumber
            , string proc_indent="")
        {
            // these help to strip off the whole path and just leave the filename.
            string dir_sep = "\\"; // for pc/xamarin
            #if __MAC__ || __IOS__
			dir_sep = "/";    //     for mac
            #endif
            int start_idx = 0;
            //if(sourceFilePath.Contains(dir_sep + "Shared" + dir_sep))
            //{
            //    start_idx = sourceFilePath.LastIndexOf(dir_sep + "Shared" + dir_sep
            //        #if __MAC__
            //        , StringComparison.InvariantCulture
            //        #endif
            //        );
            //    start_idx += "Shared".Length + 1;
            //}
            //else
            //{
            //    start_idx = sourceFilePath.LastIndexOf(dir_sep
            //        #if __MAC__
            //        , StringComparison.InvariantCulture
            //        #endif
            //        );
            //}
            start_idx = sourceFilePath.LastIndexOf(dir_sep
                #if __MAC__ || __IOS__
                , StringComparison.InvariantCulture
                #endif
                );

            int str_length = sourceFilePath.Length;

            return Global.sprintf(debug_layout_4_args, proc_indent, sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber);
        }

        //public static void DoMessageBox(string str1, string str2,
        //    [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
        //    [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
        //    [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        //{
        //    int start_idx = sourceFilePath.LastIndexOf(SysConst.kSeparator.ToString());
        //    int str_length = sourceFilePath.Length;
        //
        //    string proc_indent = GetProcIndent();
        //    //proc_indent += indent_str; 
        //    Debug.WriteLine(Global.sprintf(debug_Final_layout, FormatFileLineInfo(memberName, sourceFilePath, sourceLineNumber, proc_indent), indent_str, str2));
        //    Debug.WriteLine(Global.sprintf(debug_Final_layout, FormatFileLineInfo(memberName, sourceFilePath, sourceLineNumber, proc_indent), indent_str, str2));
        //    //MyMessageBox.Show(str);
        //}
        //
        //public class ReplayData
        //{
        //    public string FunctionName;
        //    public int XCoord;
        //    public int YCoord;
        //    public Int64 CurrentTicks;
        //
        //    public ReplayData(string fn, int x, int y, Int64 ct)
        //    {
        //        this.FunctionName = fn;
        //        this.XCoord = x;
        //        this.YCoord = y;
        //        this.CurrentTicks = ct;
        //    }
        //}
        //
        //public static List<ReplayData> ReplayDataList = new List<ReplayData>();
        //
        //public static void RecordReplayData(int x, int y, string indent = "",
        //    [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
        //    [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
        //    [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        //{
        //    int start_idx = sourceFilePath.LastIndexOf("\\");
        //    int str_length = sourceFilePath.Length;
        //    ReplayDataList.Add(new ReplayData(memberName, x, y, APP.tickCount));
        //    //Debug.WriteLine(Global.sprintf("RecordReplayData {0,28}({2,4}) {1,22}:{3} {4},{5}, {6}, {7}", sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str, x, y, APP.tickCount, ReplayDataList.Count));
        //    foreach (var i in ReplayDataList)
        //    {
        //        string str_replaydatalistcount = ReplayDataList.Count.ToString();
        //        string str_x = i.XCoord.ToString();
        //        string str_y = i.YCoord.ToString();
        //        string str_currentticks = i.CurrentTicks.ToString();
        //        //Debug.WriteLine(Global.sprintf("RecordReplayData {0,28}({2,4}) {1,22}:{3} -{4}-,-{5}-, -{6}-, -{7}-, -{8}-", sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str, str_currentticks, str_x, str_y, i.FunctionName, str_replaydatalistcount));
        //        //MyDebug.DPrint(Global.sprintf("RecordReplayData {0,28}({2,4}) {1,22}:{3} -{4}-,-{5}-, -{6}-, -{7}-, -{8}-", sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str, str_currentticks, str_x, str_y, i.FunctionName, str_replaydatalistcount));
        //        //string base_str = Global.sprintf(debug_layout_5_args, sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str, " ");
        //        string base_str = Global.sprintf(debug_Final_layout, FormatFileLineInfo(memberName, sourceFilePath, sourceLineNumber), indent, " ");
        //        
        //        //MyDebug.DPrint(Global.sprintf("{0}, -{1}-, -{2}-, -{3}-, -{4}-, -{5}-", base_str, str_currentticks, str_x, str_y, i.FunctionName, str_replaydatalistcount));
        //    }
        //}
        public static void ClearDebugFileInit(string indent)
        {
            MyDebug.DPrint_Force(Global.sprintf("{0}", indent));
            Debug.WriteLine(indent + "  ClearDebugFileInit: ");
            MyDebug.MyDebugFile.Flush();
            MyDebug.MyDebugFile.Close();
            EnterOnce = true;
            SetupOnce = false;
            MyDebugFile = null;
        }

        private static bool EnterOnce = true;
        private static int DebugTraceFileInstance = 0;
        private static void MyDebug_setup()
        {
            if (!SetupOnce)
            {
                try
                {
                    //#if !__CHROME__
                    if((MyDebugFile == null) && EnterOnce) 
                    {
                        EnterOnce = false;

                        DebugTraceFilename = "ASP_Debug_Trace";

                        //Debug.Write("Started *******************  " + System.DateTime.Now.ToShortDateString());
                        //Debug.Write("Started *******************  " + System.DateTime.Now.ToLongTimeString());
                        string time_org = System.DateTime.Now.ToLocalTime().ToString();
                        string time = time_org;
                        Debug.Write("Started *******************  " + time_org);
                        time = time.Replace("/", "_"); Debug.Write("Started *******************  " + time);
                        //time = time.Replace(" AM", "_AM"); Debug.Write("Started *******************  " + time);
                        //time = time.Replace(" PM", "_PM"); Debug.Write("Started *******************  " + time);
                        time = time.Replace(" ", "___"); Debug.Write("Started *******************  " + time);
                        time = time.Replace(":", "_"); Debug.Write("Started *******************  " + time);

                        ////DebugTraceFilename += "__" + time;

                        if(DebugTraceFileInstance++ != 0) // append an instance number if we clear/send debug file to cloud and keep going so we can debug both sides of that event
                            DebugTraceFilename += "__" + DebugTraceFileInstance;
                        DebugTraceFilename += ".log";
                        //#if !__ANDROID__
                        //MyDebugFile = DebugTraceFilename;//FileIO.GetOuputFile(DebugTraceFilename, out string full_path_name);
                        //DebugTraceFullPathname  = full_path_name;


                        string filename = @"C:\Users\dprin\TMA\" + DebugTraceFilename;

                        //FileStream fStream = new FileStream(@"C:\Users\dprin\TMA\ASP_Debug.log", FileMode.Create, FileAccess.Write);
                        ////FileStream fStream = new FileStream(@".\MyTextFromASP.txt", FileMode.Create, FileAccess.Write);
                        //StreamWriter sWriter = new StreamWriter(fStream);
                        //sWriter.WriteLine("This is just sample text from Stream Writer");
                        //sWriter.Close();
                        //fStream.Close();


                        System.Diagnostics.Debug.WriteLine("GetOuputFile: ");
                        System.Diagnostics.Debug.WriteLine("GetOuputFile: ");
                        System.Diagnostics.Debug.WriteLine("GetOuputFile: " + filename);
                        System.Diagnostics.Debug.WriteLine("GetOuputFile: ");
                        System.Diagnostics.Debug.WriteLine("GetOuputFile: ");
                        MyDebugFile = new StreamWriter(@filename);


                        
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("======== Debug output file:   {0} \n", time_org));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        Debug.Write(Global.sprintf("Started *********************************************************\n"));
                        MyDebugFile.WriteLine("Started *********************************************************");
                        MyDebugFile.WriteLine("Started *********************************************************");
                        MyDebugFile.WriteLine("Started ********************************************************* " + time_org);
                        MyDebugFile.WriteLine("Started *********************************************************");
                        MyDebugFile.WriteLine("Started *********************************************************");
                    }
                    //#else
                    //    Debug.Write(Global.sprintf("Started *********************************************************\n"));
                    //#endif
                }
                catch (Exception e)
                {
                    Global.DumpException(e, "setup");
                }
                SetupOnce = true;
            }
        }
        public static bool Disable_DebugDPrints(string indent,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            int start_idx = sourceFilePath.LastIndexOf(SysConst.kSeparator.ToString());
            int str_length = sourceFilePath.Length;

            bool state = _DebugDPrints_Enabled;
            _DebugDPrints_Enabled = false;
            // track exactly WHERE we turn it off to help debug-the-debug stuff. nothing worse than someone turning it off and leaving it off.
            //if( state )  Debug.WriteLine(Global.sprintf("{0,28}({2,4}) {1,22}:{3} Disable_DebugDPrints", sourceFilePath.Remove(0, start_idx + 1), memberName, sourceLineNumber, indent_str ));
            if(state)
            {
                //// provide a strong visual that some dprint's were turned off globally
                //MyDebug.DPrint_Force(indent + "Disable_DebugDPrints  ===================================================================================================", memberName, sourceFilePath, sourceLineNumber);
                //MyDebug.DPrint_Force(indent + "::::", memberName, sourceFilePath, sourceLineNumber);
            }
            return state;
        }
        public static void RemoveWarning( string x )
        {
            // do nothing. this is used to remove unused warnings like accepted 'catch' exceptions
        }
        public static void Restore_DebugDPrints(string indent, bool state )
            //[System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            //[System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            //[System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            //int start_idx = sourceFilePath.LastIndexOf("\\");
            //int str_length = sourceFilePath.Length;
            //
            //if(_DebugDPrints_Enabled != state)
            //{
            //    //MyDebug.DPrint_Force(indent + "::::", memberName, sourceFilePath, sourceLineNumber);
            //    //string str = Global.sprintf("{0}Restore_DebugDPrints to:  {1} ================================================================================================", indent, ((state)?"On":"Off") );
            //    //MyDebug.DPrint_Force(str, memberName, sourceFilePath, sourceLineNumber);
            //}
            _DebugDPrints_Enabled = state;
        }
        public static bool Enable_DebugDPrints(string indent,
            [System.Runtime.CompilerServices.CallerMemberName] string memberName = "",
            [System.Runtime.CompilerServices.CallerFilePath]   string sourceFilePath = "",
            [System.Runtime.CompilerServices.CallerLineNumber] int sourceLineNumber = 0)
        {
            bool prev = _DebugDPrints_Enabled;

            int start_idx = sourceFilePath.LastIndexOf(SysConst.kSeparator.ToString());
            int str_length = sourceFilePath.Length;

            if(_DebugDPrints_Enabled != true)
            {
                //Debug.WriteLine(Global.sprintf(debug_Final_layout, FormatFileLineInfo(memberName, sourceFilePath, sourceLineNumber), indent_str + indent, "Enable_DebugDPrints()"));
                MyDebug.DPrint_Force(indent + "::::", memberName, sourceFilePath, sourceLineNumber);
                MyDebug.DPrint_Force(indent + "::::", memberName, sourceFilePath, sourceLineNumber);
                string str = Global.sprintf("{0}Enable_DebugDPrints to:  On  ===================================================================================================", indent);
                MyDebug.DPrint_Force(str, memberName, sourceFilePath, sourceLineNumber);
            }
            _DebugDPrints_Enabled = true;
            return prev;
        }
        public static bool IsDebugDPrintsEnabled() { return _DebugDPrints_Enabled; }
        private static bool _DebugDPrints_Enabled = true;
        public static long TraceFlushLastStamp;
        public static long kMinTraceFlush_Millis = 3000; // 3 seconds
    }
}
