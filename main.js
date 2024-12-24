function parseCYK() {
    var grammar = document.getElementById("grammar").value;
    var inputString = document.getElementById("inputString").value;
    var result = document.getElementById("result");

    if (grammar.trim() === "" || inputString.trim() === "") {
        result.innerHTML = "Please enter both grammar and input string.";
        return;
    }

    // Split grammar rules and convert to CNF format
    var rules = grammar.trim().split('\n');
    var cnfRules = [];
    for (var i = 0; i < rules.length; i++) {
        var parts = rules[i].split('->');
        var left = parts[0].trim();
        var right = parts[1].trim().split('|');
        for (var j = 0; j < right.length; j++) {
            cnfRules.push([left, right[j].trim()]);
        }
    }

    // Perform CYK parsing
    var cykTable = [];
    for (var i = 0; i < inputString.length; i++) {
        cykTable.push([]);
        for (var j = 0; j < inputString.length; j++) {
            cykTable[i].push([]);
        }
    }

    for (var i = 0; i < inputString.length; i++) {
        for (var rule of cnfRules) {
            if (rule[1].length === 1 && rule[1] === inputString[i]) {
                cykTable[i][i].push(rule[0]);
            }
        }
    }

    for (var l = 2; l <= inputString.length; l++) {
        for (var i = 0; i <= inputString.length - l; i++) {
            var j = i + l - 1;
            for (var k = i; k < j; k++) {
                for (var rule of cnfRules) {
                    if (rule[1].length === 2) {
                        var A = rule[0];
                        var B = rule[1][0];
                        var C = rule[1][1];
                        if (cykTable[i][k].includes(B) && cykTable[k + 1][j].includes(C)) {
                            cykTable[i][j].push(A);
                        }
                    }
                }
            }
        }
    }

    if (cykTable[0][inputString.length - 1].includes('S')) {
        result.innerHTML = "Valid: The string can be derived from the grammar.";
    } else {
        result.innerHTML = "Invalid: The string cannot be derived from the grammar.";
    }
}
