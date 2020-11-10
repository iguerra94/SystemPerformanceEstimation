class Matrix4 {
  constructor(valuesVector = [], rows = 0, cols = 0) {
    this.valuesVector = valuesVector;
    this.rows = rows;
    this.cols = cols;
    this.matrix = this.getMatrix();
  }

  getMatrix() {
    let result = [];
    let row;
    let lastIndex = 0;
    let i,j;

    for (i = 0; i < this.rows; i++) {
      row = [];
      for (j = 0; j < this.cols; j++) {
        row.push(this.valuesVector[i+j+lastIndex]);
      }
      lastIndex = (i+1)*(this.cols-1);
      result.push(row);
    }

    return result;
  }

  getMatrixRow(nRow) {
    return this.matrix[nRow];
  }

  multRowAndColumnVectors(rv, cv) {
    let result = 0;

    for (let i = 0; i < rv.length; i++) {
      result += rv[i]*cv[i];
    }

    return result;
  }

  get transpose() {
    let valuesVector = [];
    let i = 0;
    let rowNr = this.cols;

    while (rowNr > 0) {
      for (let j = 0; j < this.rows; j++) {
        valuesVector.push(this.matrix[j][i])
      }
      i++;
      rowNr--;
    }

    return new Matrix4(valuesVector, this.cols, this.rows);
  }

  get inverse() {
    let result = [];

    let m00 = this.valuesVector[0],
      m01 = this.valuesVector[1],
      m02 = this.valuesVector[2],
      m03 = this.valuesVector[3];

    let m10 = this.valuesVector[4],
      m11 = this.valuesVector[5],
      m12 = this.valuesVector[6],
      m13 = this.valuesVector[7];

    let m20 = this.valuesVector[8],
      m21 = this.valuesVector[9],
      m22 = this.valuesVector[10],
      m23 = this.valuesVector[11];

    let m30 = this.valuesVector[12],
      m31 = this.valuesVector[13],
      m32 = this.valuesVector[14],
      m33 = this.valuesVector[15];

    let b00 = m00 * m11 - m01 * m10;
    let b01 = m00 * m12 - m02 * m10;
    let b02 = m00 * m13 - m03 * m10;
    let b03 = m01 * m12 - m02 * m11;
    let b04 = m01 * m13 - m03 * m11;
    let b05 = m02 * m13 - m03 * m12;
    let b06 = m20 * m31 - m21 * m30;
    let b07 = m20 * m32 - m22 * m30;
    let b08 = m20 * m33 - m23 * m30;
    let b09 = m21 * m32 - m22 * m31;
    let b10 = m21 * m33 - m23 * m31;
    let b11 = m22 * m33 - m23 * m32;

    // Calculate the determinant
    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1.0 / det;

    result[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det;
    result[1] = (m02 * b10 - m01 * b11 - m03 * b09) * det;
    result[2] = (m31 * b05 - m32 * b04 + m33 * b03) * det;
    result[3] = (m22 * b04 - m21 * b05 - m23 * b03) * det;
    result[4] = (m12 * b08 - m10 * b11 - m13 * b07) * det;
    result[5] = (m00 * b11 - m02 * b08 + m03 * b07) * det;
    result[6] = (m32 * b02 - m30 * b05 - m33 * b01) * det;
    result[7] = (m20 * b05 - m22 * b02 + m23 * b01) * det;
    result[8] = (m10 * b10 - m11 * b08 + m13 * b06) * det;
    result[9] = (m01 * b08 - m00 * b10 - m03 * b06) * det;
    result[10] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
    result[11] = (m21 * b02 - m20 * b04 - m23 * b00) * det;
    result[12] = (m11 * b07 - m10 * b09 - m12 * b06) * det;
    result[13] = (m00 * b09 - m01 * b07 + m02 * b06) * det;
    result[14] = (m31 * b01 - m30 * b03 - m32 * b00) * det;
    result[15] = (m20 * b03 - m21 * b01 + m22 * b00) * det;

    return new Matrix4(result, this.rows, this.cols);
  }

  mult(other) {
    let result = [];

    let rows = this.rows;
    let cols = other.cols;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result.push(
          this.multRowAndColumnVectors(this.getMatrixRow(i), other.transpose.getMatrixRow(j))
        );
      }
    }

    return new Matrix4(result, rows, cols);
  }
}

class SystemPerformancePolynom {
  constructor(solutionsMatrix = [], solutionsMatrixStr = []) {
    this.polynomVector = this.getPolynomVectorFromMatrix(solutionsMatrix);
    this.polynomVectorStr = this.getPolynomVectorStrFromMatrix(solutionsMatrixStr);
  }

  getPolynomVectorFromMatrix(solutionsMatrix) {
    let resultVector = [];
    for (const solution of solutionsMatrix) {
      resultVector.push(...solution);
    }
    return resultVector;
  }

  getPolynomVectorStrFromMatrix(solutionsMatrixStr) {
    let resultVector = [];
    for (const solution of solutionsMatrixStr) {
      resultVector.push(...solution);
    }
    return resultVector;
  }

  getPolynomFixedToNDecimals(n) {
    let solutionsMatrix = [];
    let solutionsMatrixStr = [];

    for (const term of this.polynomVector) {
      const termParts = term.toString().split('.');
      console.log(termParts);
      const newTerm = `${termParts[0]}.${termParts[1].substring(0,n)}`;
      solutionsMatrix.push([Number(newTerm)]);
      solutionsMatrixStr.push([newTerm]);
    }

    return new SystemPerformancePolynom(solutionsMatrix, solutionsMatrixStr);
  }

  getPolynomToStringFixedToNDecimals(n) {
    const polynom = this.getPolynomFixedToNDecimals(n);

    let polynomString = "";
    let polynomGrade = this.polynomVector.length -1;
    const epsilon = 0.01;

    const separator = (term) => (term > 0) ? " + " : " - ";

    for (const term of polynom.polynomVector) {
      const termFixed = term.toFixed(2);
      if (Math.abs(termFixed) > epsilon) {
        polynomString += `${termFixed}*n^${polynomGrade}${separator(termFixed)}`;
      }
      polynomGrade--;
    }

    return polynomString.substr(0, polynomString.length-2);
  }

  getPolynomStrToStringFixedToNDecimals(n) {
    const polynom = this.getPolynomFixedToNDecimals(n);

    let polynomString = "";
    let polynomGrade = this.polynomVectorStr.length -1;
    const epsilon = 0.01;

    const separator = (term) => (term > 0) ? " + " : " - ";

    for (const term of polynom.polynomVectorStr) {
      const termFixed = Number(term).toFixed(n);
      if (Math.abs(termFixed) > epsilon) {
        polynomString += `${termFixed}*n^${polynomGrade}${separator(termFixed)}`;
      }
      polynomGrade--;
    }

    return polynomString.substr(0, polynomString.length-2);
  }

  getPolynomSolutionFixedToNDecimalsForTargetValue(target, n) {
    let solution = 0;
    let polynomGrade = this.polynomVectorStr.length -1;

    for (const term of this.polynomVectorStr) {
      const termFixed = Number(term).toFixed(n);
      solution += termFixed * (Math.pow(target, polynomGrade));
      polynomGrade--;
    }

    return solution.toFixed(n);
  }

  getPolynomSolutionsFixedToNDecimalsForTargetRange(range, decimals) {
    let solutions = [];

    for (const value of range) {
      const solution = this.getPolynomSolutionFixedToNDecimalsForTargetValue(value, decimals);
      solutions.push(Number(solution));
    }
    return solutions;
  }
}

export { Matrix4, SystemPerformancePolynom }