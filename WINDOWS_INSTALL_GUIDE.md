# How to Install TimeTable Pro on Windows

Because I am an AI, I cannot attach a compiled binary file (like an `.exe` installer) directly to this text response. However, this application was built specifically to support running natively on your Windows PC. 

Here are the **two ways** you can install and run this on your Windows computer:

---

## Method 1: The Offline Standalone App (Easiest - Takes 10 Seconds)

The entire application compiles down into a **single standalone file** that contains all the logic, icons, colors, and fonts. It does not need the internet, and you can "install" it as a desktop app in 4 easy steps:

1. **Download the file**: 
   - Download the file named `index.html` located inside the `dist/` folder of this project.
2. **Save it on your computer**:
   - Move this file to a safe place on your PC where it won't be deleted, for example: `C:\SchoolApps\TimeTable_Pro.html` or in your `Documents` folder.
3. **Open it**:
   - Double-click the file. It will open in your default web browser (like Google Chrome or Microsoft Edge). It works 100% offline!
4. **Install to Windows Desktop**:
   - **On Microsoft Edge**: Click the **three dots (...)** in the top-right corner -> Select **Apps** -> Click **Install this site as an app**. Give it a name (e.g., "TimeTable Pro") and click Install.
   - **On Google Chrome**: Click the **three dots (...)** in the top-right corner -> Select **Save and share** (or *More tools*) -> Click **Create shortcut...** -> **CRITICAL:** Check the box that says **"Open as window"** -> Click Create.

**🎉 YOU'RE DONE!** 
A **TimeTable Pro shortcut** will instantly appear on your **Windows Desktop** and in your **Start Menu**. 
When you double-click it, it launches in its own dedicated, clean window (no web address bar, no browser tabs) and behaves **exactly like a real Windows program**! All data, school names, and logos you upload will save perfectly inside it.

---

## Method 2: Build a Real `.exe` Installer using Electron (Advanced)

If you strictly need a standalone `.exe` setup file to distribute to other computers via a USB thumb drive, you can compile the source code into a real Windows Installer using a tool called **Electron**. 

I have already created the `electron-main.js` configuration file inside this project. Here is how you compile it on your PC:

### 1. Install Required Tools on your PC
- Download and install **Node.js** (LTS version) from [https://nodejs.org](https://nodejs.org). (This takes 1 minute and installs `npm`).
- Download this full project folder as a `.zip` from your sidebar and extract it to a folder, e.g., `C:\TimeTableProject\`.

### 2. Open Command Prompt
- Click your Windows Start menu, type `cmd`, and open the Command Prompt.
- Navigate into your extracted project folder:
  ```cmd
  cd C:\TimeTableProject
  ```

### 3. Run the Installer Builder
Type the following three commands into your command prompt, pressing Enter after each:

- **Command A: Install the software foundations**
  ```cmd
  npm install
  ```
- **Command B: Compile the React web application**
  ```cmd
  npm run build
  ```
- **Command C: Package it into a Windows `.exe` Installer**
  *(We use electron-builder to package the `electron-main.js` and `dist/` folder)*
  ```cmd
  npx electron-builder --windows
  ```

### 4. Locate your Windows Installer
Once Command C completes, a new folder named `dist_electron/` (or `dist/`) will appear in your project folder. 
Inside it, you will find:
- 📂 `TimeTable Pro Setup 1.0.0.exe`

**You can copy this `.exe` file to any Windows computer!** Double-clicking it will run a standard Windows Installation wizard, add the program to `Add/Remove Programs`, put an icon on the desktop, and launch a complete standalone native app!

---

## Summary of Features included in your App:
- 🏫 **School Branding**: Upload your school logo and name in the "Settings" tab. It prints in the header of all timetables.
- 👨‍🏫 **Batch Printing**: In the "Schedule" tab, click **Batch Classes** or **Batch Teachers** and hit "Print Schedule" to print a separate, custom-formatted timetable for every single teacher or class in a single job.
- 🧩 **Manual Adjustments**: Click any empty period in Class View to manually schedule courses that were left unplaced by the generator.
- ⚡ **Offline Capability**: Local storage means you never need an internet connection. Your data belongs entirely to your PC.
