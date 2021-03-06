#include "parse.h"
#include "factories.h"
#include "log.h"
#include <iostream>
#include <sstream>
#include <cassert>

using namespace std;

struct ErrorLocation
{
  int line;
  int lineStart;
  int column;
};

void computeErrorLocation(ErrorLocation &errorLocation, int &where, string text)
{
  errorLocation.line = 1;
  errorLocation.column = 0;
  errorLocation.lineStart = -1;
  assert(where < len(text));
  for (int i = 0; i < where; ++i) {
    if (text[i] == '\n') {
      errorLocation.line++;
      errorLocation.lineStart = i + 1;
      errorLocation.column = 0;
    }
    errorLocation.column++;
  }
}

void printErrorLocation(ErrorLocation &errorLocation, int &where, string text)
{
  for (int i = errorLocation.lineStart; text[i] != '\n' && i <= min(where + 16, len(text) - 1); ++i) {
    cout << text[i];
  }
  cout << endl;
  for (int i = errorLocation.lineStart; i < where; ++i) {
    cout << ' ';
  }
  cout << '^' << endl;
}

void parseError(string error, int &where, string text)
{
  ErrorLocation errorLocation;
  computeErrorLocation(errorLocation, where, text);
  cout << "Error: " << error << " at line " << errorLocation.line << ", column " << errorLocation.column << "." << endl;
  printErrorLocation(errorLocation, where, text);
  exit(0);
}

void expected(string what, int &where, string text)
{
  ErrorLocation errorLocation;
  computeErrorLocation(errorLocation, where, text);
  cout << "expected " << what << " at line " << errorLocation.line << ", column " << errorLocation.column << "." << endl;
  printErrorLocation(errorLocation, where, text);
  exit(0);
}

bool isIdentifierChar(char c)
{
  return c == '_' || isalpha(c) || isdigit(c); 
}

string getQuotedString(string &s, int &pos)
{
  string str = "";

  matchString(s, pos, "\"");
  while (pos < len(s) && s[pos] != '"') {
    str += s[pos];
    pos++;
  }
  matchString(s, pos, "\"");
  
  return str;
}

bool lookAheadIdentifier(string &s, int &pos)
{
  if (pos < len(s) && isIdentifierChar(s[pos])) {
    return true;
  }
  return false;
}

string getIdentifier(string &s, int &pos)
{
  string id = "";
  if (pos < len(s) && isIdentifierChar(s[pos])) {
    while (pos < len(s) && isIdentifierChar(s[pos])) {
      id += s[pos];
      pos++;
    }
  } else {
    expected("identifier", pos, s);
  }
  return id;
}

int getNumber(string &s, int &pos)
{
  int result;
  if (pos >= len(s) || !isdigit(s[pos])) {
    expected("number", pos, s);
  }
  string str;
  while (pos < len(s) && isdigit(s[pos])) {
    str += s[pos];
    pos++;
  }
  istringstream iss(str);
  iss >> result;
  return result;
}

void skipWhiteSpace(string &s, int &pos)
{
  bool progress;
  do {
    progress = false;
    while (pos < len(s) && (s[pos] == ' ' || s[pos] == '\t' || s[pos] == '\n' || s[pos] == '\r')) {
      pos++;
    }
    if (pos + 1 < len(s) && s[pos] == '/' && s[pos + 1] == '*') {
      match(s, pos, '/');
      match(s, pos, '*');
      while (pos + 1 < len(s) && !(s[pos] == '*' && s[pos + 1] == '/')) {
	pos++;
      }
      if (pos + 1 >= len(s)) {
	expected("end of comment", pos, s);
      }
      match(s, pos, '*');
      match(s, pos, '/');
      progress = true;
    }
    if (pos + 1 < len(s) && s[pos] == '/' && s[pos + 1] == '/') {
      match(s, pos, '/');
      match(s, pos, '/');
      while (pos < len(s) && s[pos] != '\n' && s[pos] != '\r') {
	pos++;
      }
      if (pos < len(s)) {
	if (s[pos] == '\n') {
	  match(s, pos, '\n');
	}
	if (s[pos] == '\r') {
	  match(s, pos, '\r');
	}
	assert(0);
      }
      progress = true;
    }
  } while (progress);
}

bool lookAhead(string &s, int &pos, string what)
{
  for (int i = 0; i < len(what); ++i) {
    if (pos + i >= len(s) || s[pos + i] != what[i]) {
      return false;
    }
  }
  return true;
}

void matchString(string &s, int &pos, string what)
{
  for (int i = 0; i < len(what); ++i) {
    if (!(pos + i < len(s) && s[pos + i] == what[i])) {
      ostringstream oss;
      oss << "\"" << what << "\"";
      expected(oss.str(), pos, s);
    }
  }
  pos += len(what);
}

void match(string &s, int &pos, char c)
{
  if (pos < len(s) && s[pos] == c) {
    pos++;
  } else {
    ostringstream oss;
    oss << c;
    expected(oss.str(), pos, s);
  }
}

Term *parseTerm(string &s, int &pos)
{
  skipWhiteSpace(s, pos);
  string id = getIdentifier(s, pos);
  Function *f = getFunction(id);
  Variable *v = getVariable(id);
  //  Name *n = getName(id);

  if (f) {
    skipWhiteSpace(s, pos);
    vector<Term *> arguments;
    if (len(f->arguments)) {
      match(s, pos, '(');
      for (int i = 0; i < len(f->arguments); ++i) {
	Term *t = parseTerm(s, pos);
	skipWhiteSpace(s, pos);
	if (i == len(f->arguments) - 1) {
	  match(s, pos, ')');
	} else {
	  match(s, pos, ',');
	}
	arguments.push_back(t);
      }
    }
    return getFunTerm(f, arguments);
  } else if (v) {
    return getVarTerm(v);
  }//  else if (n) {
  //   return getNamTerm(n);
  // }
  cout << "this id: " << id << " is not a name, not a var, not a function " << endl;
  assert(0);
  return 0;
}

Term *parseTerm(string &s)
{
  int position = 0;
  return parseTerm(s, position);
}

Term *parseTerm(const char *s)
{
  string str(s);
  return parseTerm(str);
}

ConstrainedTerm parseConstrainedTerm(string &s, int &w)
{
  Log(DEBUG) << "Parsing constrained term" << endl;
  skipWhiteSpace(s, w);
  Term *term = parseTerm(s, w);
  Log(DEBUG) << "Parsed main term: " << term->toString() << endl;
  Term *constraint;
  skipWhiteSpace(s, w);
  if (lookAhead(s, w, "/\\")) {
    matchString(s, w, "/\\");
    skipWhiteSpace(s, w);
    constraint = parseTerm(s, w);
    Log(DEBUG) << "Parsed constraint term: " << constraint->toString() << endl;
  } else {
    constraint = bTrue();
    assert(constraint);
    Log(DEBUG) << "Implicit constraint: " << constraint->toString() << endl;
  }
  return ConstrainedTerm(term, constraint);
}
