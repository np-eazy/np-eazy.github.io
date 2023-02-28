import { coinFlip, 
    interpolateTrig, 
    randRange, 
  } from '../../../utils/functions';
import { complex, sqrt, exp, sin, cos, add, subtract, multiply, divide, asin } from 'mathjs';
import { atan, acos, pow } from 'mathjs';
import { interpolateColor, themeTransientCycle, WHITE } from '../../../utils/colors';

let A0: f32 = 0.25;
let factorials: [i32; 10] = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
let doubleFactorials: [i32; 10] = [1, 1, 2, 3, 8, 15, 48, 105, 384, 945];

fn getFactorial(n: i32) {
    if n <= 0 {
        return 1;
    } else if n <= 10 {
        return factorials[n - 1];
    } else {
        let soln = 1;
        for i in 0..n {
            soln *= i + 1;
        }
        return soln;
    }
};

fn getDoubleFactorial(n: i32) {
    if n <= 0 {
        return 1;
    } else if n <= 10 {
        return doubleFactorials[n - 1];
    } else {
        let soln = 1;
        for i in 0..n {
            if i + 1 % 2 == n % 2 {
                soln *= i + 1;
            }
        }
        return soln;
    }
};

fn choose(n: i32, k: i32) {
    return getFactorial(n) / (getFactorial(n - k) * getFactorial(k));
};

fn mapToSpherical(x: f32, y: f32, z: f32) {
    let rho = sqrt(x * x + y * y + z * z);
    let theta = atan(y / x);
    let phi = acos(z / rho);
    return rho, theta, phi;
}


fn getLaguerrePolynomial(n: i32, l: i32) {
    let kl = 2 * l + 1;
    let nl = n - l - 1;
    return (rho: f32) -> f32 {
        let signedPower = 1;
        let total = 0;
        for i in 0..n {
            total += signedPower * getFactorial(nl) * choose(kl + nl, nl - i) / getFactorial(i);
            signedPower *= -rho;
        }
        let constTerm = sqrt(pow(2 / (n * A0), 3) * getFactorial(n - l - 1) / (2 * n * getFactorial(n + l)));
        let radius = (2 * rho) / (n * A0);
        return total * constTerm * exp(radius / -2) * pow(radius, l);
    }
};

fn getLegendrePolynomial(l: i32, m: i32) {
    return (rho: f32) -> f32 {
        let sign = m % 2 == 0 ? 1 : -1;
        let base = sign * getDoubleFactorial(2 * m - 1) * pow((1 - rho * rho), l / 2);
        let nextBase = (2 * m + 1) * rho * base;
        if (l - m == 0) {
            return base;
        } else if (l - m == 1) {
            return nextBase;
        } else if (l - m >= 2) {
            for i in 0..(l-m-1) {
                var nextPolynomial = ((2 * l + 1) * nextBase - (l + m) * base) / (l - m + 1);
                base = nextBase;
                nextBase = nextPolynomial;
            }
            return nextPolynomial;
        }
    }
};

fn getSphericalHarmonic(l: i32, m: i32) {
    return (phi: f32) -> f32 {
        let sign = m % 2 == 0 ? 1 : -1;
        let normalization = complex(sqrt((getFactorial(l - m) * (2 * l + 1)) / (getFactorial(l + m) * 4 * Math.PI)), 0);
        return multiply(sign, normalization, exp(complex(0, m * phi)));
    };
};

pub fn getFunctional(n: i32, l: i32, m: i32) {
    return (x: f32, y: f32, z: f32) -> f32 {
        let rho, theta, phi = mapToSpherical(x, y, z);
        
        return multiply(getLaguerrePolynomial(n, l)(rho), getLegendrePolynomial(l, m)(cos(theta)), getSphericalHarmonic(l, m)(phi));
    };
}

pub fn getGradient(n: i32, l: i32, m: i32, timer: f32) {

    let delta = 0.00000001;

    return (x, y, z) => {
        let rho, theta, phi = mapToSpherical(x, y, z);

        let frho = getLaguerrePolynomial(n, l)(rho + delta / 2);
        let ftheta = getLegendrePolynomial(l, m)(cos(theta) + delta / 2);
        let fphi = getSphericalHarmonic(l, m)(phi + delta / 2);

        let deltaRho = divide(subtract(frho, getLaguerrePolynomial(n, l)(rho - delta / 2)), (delta));
        let deltaTheta = divide(subtract(ftheta, getLegendrePolynomial(l, m)(cos(theta) - delta / 2)), (delta * rho));
        let deltaPhi = divide(subtract(fphi, getSphericalHarmonic(l, m)(phi - delta / 2)), (delta * rho * Math.sin(theta)));

        deltaRho = multiply(deltaRho, ftheta, fphi);
        deltaTheta = multiply(deltaTheta, frho, fphi);
        deltaPhi = multiply(deltaPhi, frho, ftheta);

        let unitRho = [sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta)];
        let unitTheta = [cos(theta) * cos(phi), cos(theta) * sin(phi), sin(theta) * -1];
        let unitPhi = [sin(phi), cos(phi)*-1, 0.0];

        return [
            add(multiply(unitRho[0], deltaRho), multiply(unitTheta[0], deltaTheta), multiply(unitPhi[0], deltaPhi)),
            add(multiply(unitRho[1], deltaRho), multiply(unitTheta[1], deltaTheta), multiply(unitPhi[1], deltaPhi)),
            add(multiply(unitRho[2], deltaRho), multiply(unitTheta[2], deltaTheta), multiply(unitPhi[2], deltaPhi)),
        ];
    }
}

fn getEnergyLevel(n) {
    return 5 / (n * n);
}
