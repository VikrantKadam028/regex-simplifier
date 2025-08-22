## @vikrant_kadam/regex-simplifier

![npm](https://img.shields.io/npm/v/@vikrant_kadam/regex-simplifier?style=for-the-badge&color=blue)
![npm downloads](https://img.shields.io/npm/dw/@vikrant_kadam/regex-simplifier?style=for-the-badge&color=green)
![license](https://img.shields.io/npm/l/@vikrant_kadam/regex-simplifier?style=for-the-badge&color=yellow)
![issues](https://img.shields.io/github/issues/VikrantKadam028/regex-simplifier?style=for-the-badge&color=red)


## 🌟 Overview 
The **@vikrant_kadam/regex-simplifier** is a lightweight and intuitive npm package designed to make working with regular expressions easier for developers of all skill levels.  
It abstracts away the complex syntax of regex by providing a set of simple, human-readable functions.

---

## ✨ Features
This package offers three core functionalities:

- **`englishToRegex`** → Convert plain English descriptions into a regex pattern.  
- **`regexToEnglish`** → Get a plain English explanation for a given regex pattern.  
- **`testRegex`** → Test a regex pattern against a sample string to see what it matches.  

---

## 📦 Installation
To add this package to your project, simply run:

```bash
npm install @vikrant_kadam/regex-simplifier
```
---

## 🚀 Usage Examples
This guide provides a set of examples demonstrating how to use the functions from the regex-simplifier library.

## English to Regex
This command converts a plain English phrase into a regular expression pattern.
```bash
const { englishToRegex } = require("@vikrant_kadam/regex-simplifier")
const pattern = englishToRegex("an email address")
console.log(pattern) 
# => /^[\w.-]+@[\w.-]+\.\w{2,}$/

```

## Regex to English
This command translates a regular expression pattern into a human-readable English description.
```bash
const { regexToEnglish } = require("@vikrant_kadam/regex-simplifier")

console.log(regexToEnglish(/^\d{3}-\d{2}-\d{4}$/))
# => Matches a number in the format 3 digits-2 digits-4 digits

```

## Test Regex
This command tests whether a given string matches a specific regular expression pattern.
```bash
const { testRegex } = require("@vikrant_kadam/regex-simplifier")

console.log(testRegex(/hello/i, "Hello World"))
# => true

```
---

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page or submit a pull request.

**If you’d like to contribute:**

1. Fork the repository  
2. Create a new feature branch (`git checkout -b feature-xyz`)  
3. Commit your changes (`git commit -m "Added feature xyz"`)  
4. Push to the branch (`git push origin feature-xyz`)  
5. Open a pull request 🎉

---

## License


MIT License © 2025 **Vikrant Kadam**

