#pragma once

#include <iostream>
#include <math.h>
using namespace std;



namespace Project4 {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;
	using namespace System::IO::Ports;
	using namespace ZedGraph;
	
	
	

	/// <summary>
	/// Summary for MyForm
	/// </summary>
	public ref class MyForm : public System::Windows::Forms::Form
	{
	public:
		
	String ^ user;
	GraphPane ^ mypane;
		

	private: System::Windows::Forms::ListBox^  listBox1;
	private: System::Windows::Forms::Button^  button3;
	private: System::Windows::Forms::Button^  button4;
	private: System::Windows::Forms::Button^  button5;
	private: System::Windows::Forms::SaveFileDialog^  saveFileDialog1;
	private: System::Windows::Forms::MenuStrip^  menuStrip1;
	private: System::Windows::Forms::ToolStripMenuItem^  fileToolStripMenuItem;
	private: System::Windows::Forms::ToolStripMenuItem^  editToolStripMenuItem;
	private: System::Windows::Forms::ToolStripMenuItem^  helpToolStripMenuItem;
	private: System::Windows::Forms::ToolStripMenuItem^  aboutToolStripMenuItem;
	private: ZedGraph::ZedGraphControl^  zedGraphControl1;


	public: 
		static array<System::String ^,1>^  ports;

		MyForm(void)
		{
			InitializeComponent();
			//
			//TODO: Add the constructor code here
			//
		}

	protected:
		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		~MyForm()
		{
			if (components)
			{
				delete components;
			}
		}
	private: System::Windows::Forms::Button^  button1;
	private: System::Windows::Forms::TextBox^  textBox1;
	private: System::Windows::Forms::Button^  button2;
	private: System::ComponentModel::IContainer^  components;
	protected: 

	private:
		/// <summary>
		/// Required designer variable.
		/// </summary>


#pragma region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		void InitializeComponent(void)
		{
			this->components = (gcnew System::ComponentModel::Container());
			this->button1 = (gcnew System::Windows::Forms::Button());
			this->textBox1 = (gcnew System::Windows::Forms::TextBox());
			this->button2 = (gcnew System::Windows::Forms::Button());
			this->listBox1 = (gcnew System::Windows::Forms::ListBox());
			this->button3 = (gcnew System::Windows::Forms::Button());
			this->button4 = (gcnew System::Windows::Forms::Button());
			this->button5 = (gcnew System::Windows::Forms::Button());
			this->saveFileDialog1 = (gcnew System::Windows::Forms::SaveFileDialog());
			this->menuStrip1 = (gcnew System::Windows::Forms::MenuStrip());
			this->fileToolStripMenuItem = (gcnew System::Windows::Forms::ToolStripMenuItem());
			this->editToolStripMenuItem = (gcnew System::Windows::Forms::ToolStripMenuItem());
			this->helpToolStripMenuItem = (gcnew System::Windows::Forms::ToolStripMenuItem());
			this->aboutToolStripMenuItem = (gcnew System::Windows::Forms::ToolStripMenuItem());
			this->zedGraphControl1 = (gcnew ZedGraph::ZedGraphControl());
			this->menuStrip1->SuspendLayout();
			this->SuspendLayout();
			// 
			// button1
			// 
			this->button1->Location = System::Drawing::Point(12, 56);
			this->button1->Name = L"button1";
			this->button1->Size = System::Drawing::Size(139, 23);
			this->button1->TabIndex = 0;
			this->button1->Text = L"Initialize COM";
			this->button1->UseVisualStyleBackColor = true;
			this->button1->Click += gcnew System::EventHandler(this, &MyForm::button1_Click);
			// 
			// textBox1
			// 
			this->textBox1->Location = System::Drawing::Point(157, 233);
			this->textBox1->Multiline = true;
			this->textBox1->Name = L"textBox1";
			this->textBox1->Size = System::Drawing::Size(81, 80);
			this->textBox1->TabIndex = 1;
			// 
			// button2
			// 
			this->button2->Location = System::Drawing::Point(12, 111);
			this->button2->Name = L"button2";
			this->button2->Size = System::Drawing::Size(139, 27);
			this->button2->TabIndex = 2;
			this->button2->Text = L"COM Ports list";
			this->button2->UseVisualStyleBackColor = true;
			this->button2->Click += gcnew System::EventHandler(this, &MyForm::button2_Click);
			// 
			// listBox1
			// 
			this->listBox1->FormattingEnabled = true;
			this->listBox1->Location = System::Drawing::Point(157, 27);
			this->listBox1->Name = L"listBox1";
			this->listBox1->Size = System::Drawing::Size(81, 95);
			this->listBox1->TabIndex = 3;
			// 
			// button3
			// 
			this->button3->Location = System::Drawing::Point(12, 165);
			this->button3->Name = L"button3";
			this->button3->Size = System::Drawing::Size(139, 23);
			this->button3->TabIndex = 4;
			this->button3->Text = L"Start";
			this->button3->UseVisualStyleBackColor = true;
			this->button3->Click += gcnew System::EventHandler(this, &MyForm::button3_Click);
			// 
			// button4
			// 
			this->button4->Location = System::Drawing::Point(12, 210);
			this->button4->Name = L"button4";
			this->button4->Size = System::Drawing::Size(139, 23);
			this->button4->TabIndex = 5;
			this->button4->Text = L"Pause";
			this->button4->UseVisualStyleBackColor = true;
			// 
			// button5
			// 
			this->button5->Location = System::Drawing::Point(12, 290);
			this->button5->Name = L"button5";
			this->button5->Size = System::Drawing::Size(139, 23);
			this->button5->TabIndex = 6;
			this->button5->Text = L"End";
			this->button5->UseVisualStyleBackColor = true;
			// 
			// saveFileDialog1
			// 
			this->saveFileDialog1->FileOk += gcnew System::ComponentModel::CancelEventHandler(this, &MyForm::saveFileDialog1_FileOk);
			// 
			// menuStrip1
			// 
			this->menuStrip1->Items->AddRange(gcnew cli::array< System::Windows::Forms::ToolStripItem^  >(4) {this->fileToolStripMenuItem, 
				this->editToolStripMenuItem, this->helpToolStripMenuItem, this->aboutToolStripMenuItem});
			this->menuStrip1->Location = System::Drawing::Point(0, 0);
			this->menuStrip1->Name = L"menuStrip1";
			this->menuStrip1->Size = System::Drawing::Size(688, 24);
			this->menuStrip1->TabIndex = 7;
			this->menuStrip1->Text = L"menuStrip1";
			// 
			// fileToolStripMenuItem
			// 
			this->fileToolStripMenuItem->Name = L"fileToolStripMenuItem";
			this->fileToolStripMenuItem->Size = System::Drawing::Size(37, 20);
			this->fileToolStripMenuItem->Text = L"File";
			// 
			// editToolStripMenuItem
			// 
			this->editToolStripMenuItem->Name = L"editToolStripMenuItem";
			this->editToolStripMenuItem->Size = System::Drawing::Size(39, 20);
			this->editToolStripMenuItem->Text = L"Edit";
			// 
			// helpToolStripMenuItem
			// 
			this->helpToolStripMenuItem->Name = L"helpToolStripMenuItem";
			this->helpToolStripMenuItem->Size = System::Drawing::Size(44, 20);
			this->helpToolStripMenuItem->Text = L"Help";
			// 
			// aboutToolStripMenuItem
			// 
			this->aboutToolStripMenuItem->Name = L"aboutToolStripMenuItem";
			this->aboutToolStripMenuItem->Size = System::Drawing::Size(52, 20);
			this->aboutToolStripMenuItem->Text = L"About";
			// 
			// zedGraphControl1
			// 
			this->zedGraphControl1->AutoScroll = true;
			this->zedGraphControl1->BackgroundImageLayout = System::Windows::Forms::ImageLayout::Center;
			this->zedGraphControl1->Dock = System::Windows::Forms::DockStyle::Right;
			this->zedGraphControl1->Location = System::Drawing::Point(256, 24);
			this->zedGraphControl1->Name = L"zedGraphControl1";
			this->zedGraphControl1->ScrollGrace = 0;
			this->zedGraphControl1->ScrollMaxX = 0;
			this->zedGraphControl1->ScrollMaxY = 0;
			this->zedGraphControl1->ScrollMaxY2 = 0;
			this->zedGraphControl1->ScrollMinX = 0;
			this->zedGraphControl1->ScrollMinY = 0;
			this->zedGraphControl1->ScrollMinY2 = 0;
			this->zedGraphControl1->SelectModifierKeys = System::Windows::Forms::Keys::D4;
			this->zedGraphControl1->Size = System::Drawing::Size(432, 327);
			this->zedGraphControl1->TabIndex = 8;
			this->zedGraphControl1->Visible = false;
			this->zedGraphControl1->Load += gcnew System::EventHandler(this, &MyForm::zedGraphControl1_Load);
			// 
			// MyForm
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(6, 13);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(688, 351);
			this->Controls->Add(this->zedGraphControl1);
			this->Controls->Add(this->button5);
			this->Controls->Add(this->button4);
			this->Controls->Add(this->button3);
			this->Controls->Add(this->listBox1);
			this->Controls->Add(this->button2);
			this->Controls->Add(this->textBox1);
			this->Controls->Add(this->button1);
			this->Controls->Add(this->menuStrip1);
			this->Name = L"MyForm";
			this->Text = L"AreteX - BIS Monitor";
			this->Load += gcnew System::EventHandler(this, &MyForm::MyForm_Load);
			this->menuStrip1->ResumeLayout(false);
			this->menuStrip1->PerformLayout();
			this->ResumeLayout(false);
			this->PerformLayout();

		}
#pragma endregion
	
	
	//Initialize COM and Ask User for file save location
	private: System::Void button1_Click(System::Object^  sender, System::EventArgs^  e) {

				 user = "brian";
				 listBox1->Items->Add(user); // Adds items to the list (argument of ADD() can be anything, in this case a string)
				 saveFileDialog1->ShowDialog();
				 //saveFileDialog1->DefaultExt->con
					
			 }
	
	
	//Show list of available COM Ports
	private: System::Void button2_Click(System::Object^  sender, System::EventArgs^  e) {

				 SerialPort::SerialPort(); // Initializes a Serial Port Instance
				 ports = SerialPort::GetPortNames(); // Store array of port names(string ^) into ports
				 
				 for each(String^ port in ports)
					{
						listBox1->Items->Add(port);
						//textBox1->Text=port; // Print Port name on Textbox1
					}
				
			 }
	
			 
	//Start Data Capture
	private: System::Void button3_Click(System::Object^  sender, System::EventArgs^  e) {

				 
				MyForm::zedGraphControl1->GraphPane->Title->Text = "BIS MONITOR";
				MyForm::zedGraphControl1->GraphPane->XAxis->Title->Text = "TIME(Min)";
				MyForm::zedGraphControl1->GraphPane->YAxis->Title->Text = "SCORE";
				MyForm::zedGraphControl1->IsShowHScrollBar = true;
				MyForm::zedGraphControl1->IsShowVScrollBar = true;
				MyForm::zedGraphControl1->ScrollMaxX = 1000; // make it so that it changes over time (dynamic)
				MyForm::zedGraphControl1->ScrollMaxY = 100; //// make it so that it changes over time (dynamic)
				MyForm::zedGraphControl1->Size =
				PointPairList ^ list = gcnew PointPairList(); 
			
				 double x[100];
				 double y[100];
				 double z[100];

				for (int i = 0; i < 50; i++)
				{
					x[i] = i;
					y[i] =5* Math::Sin(0.3 * x[i]);
					z[i] = Math::Cos(0.3 * x[i]);
					
					list->Add(x[i],y[i]);
				}

				LineItem ^ mycurve = MyForm::zedGraphControl1->GraphPane->AddCurve("sine wave",list,Color::Red, SymbolType::Diamond);
				
				  
			    zedGraphControl1->Show(); // Show graph after pressing start for the first time
				
			 }


	//Pause Data Capture
	private: System::Void MyForm_Load(System::Object^  sender, System::EventArgs^  e) {
			 }


	//End Data Capture
	private: System::Void saveFileDialog1_FileOk(System::Object^  sender, System::ComponentModel::CancelEventArgs^  e) {


			}
	


	//X-Y PLOT
	private: System::Void zedGraphControl1_Load(System::Object^  sender, System::EventArgs^  e) {
				 			
				 RectangleF rect = RectangleF();
				 GraphPane ^ myPane = gcnew GraphPane( rect, "BIS MONITOR", "TIME (min)", "Y (SCORE)" );
				 myPane->Title->Text = "BIS MONITOR";
				 zedGraphControl1->Refresh();

				
				 
 
				

			
		    }



};
}
