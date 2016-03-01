#include "MyForm.h"
#include <iostream>
#include <fstream>
#include <string>
#include <stdio.h>
#include <math.h>



using namespace System::Windows::Forms;
using namespace System;
using namespace std;
using namespace ZedGraph;


[STAThread]
int main(array<String^>^args){

	Application::EnableVisualStyles();
	Application::SetCompatibleTextRenderingDefault(false);
	Project4::MyForm form;
	Application::Run(%form);

	return 0;
}

