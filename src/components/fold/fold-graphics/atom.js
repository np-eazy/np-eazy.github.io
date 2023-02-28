import { coinFlip, 
    interpolateTrig, 
    randRange, 
  } from '../../../utils/functions';
import { complex, sqrt, exp, sin, cos, add, subtract, multiply, divide, asin } from 'mathjs';
import { atan, acos, pow } from 'mathjs';
import { interpolateColor, themeTransientCycle, WHITE } from '../../../utils/colors';

const A0 = 0.125;

const factorials = [];
var total = 1;
for (var i = 0; i < 10; i++) {
    total *= i + 1;
    factorials.push(total);
}

export function getFactorial(n) {
    if (n <= 0) {
        return 1;
    } else if (n <= 10) {
        return factorials[n - 1];
    } else {
        var soln = 1;
        for (var i = 0; i < n; i++) {
            soln *= i + 1;
        }
        return soln;
    }
};

export function getDoubleFactorial(n) {
    if (n <= 0) {
        return 1;
    } else {
        var soln = 1;
        for (var i = 0; i < n; i++) {
            if (i + 1 % 2 == n % 2) {
                soln *= i + 1;
            }
        }
        return soln;
    }
};

export function choose(n, k) {
    return getFactorial(n) / (getFactorial(n - k) * getFactorial(k));
};

export function mapToSpherical(x, y, z) {
    var rho = sqrt(x * x + y * y + z * z);
    var theta = atan(y / x);
    var phi = acos(z / rho);
    return [rho, theta, phi];
}


export function getLaguerrePolynomial(n, l) {
    return (rho) => {
        var kl = 2 * l + 1;
        var nl = n - l - 1;
        var signedPower = 1;
        var total = 0;
        for (var i = 0; i <= n; i++) {
            total += signedPower * getFactorial(nl) * choose(kl + nl, nl - i) / getFactorial(i);
            signedPower *= -rho;
        }
        var constTerm = sqrt(pow(2 / (n * A0), 3) * getFactorial(n - l - 1) / (2 * n * getFactorial(n + l)));
        var radius = (2 * rho) / (n * A0);
        return total * constTerm * exp(radius / -2) * pow(radius, l);
    }
};

export function getLegendrePolynomial(l, m) {
    return (rho) => {
        var sign = m % 2 == 0 ? 1 : -1;
        var base = sign * getDoubleFactorial(2 * m - 1) * pow((1 - rho * rho), l / 2);
        var nextBase = (2 * m + 1) * rho * base;
        if (l - m == 0) {
            return base;
        } else if (l - m == 1) {
            return nextBase;
        } else if (l - m >= 2) {
            for (var i = 0; i < l - m - 1; i++) {
                var nextPolynomial = ((2 * l + 1) * nextBase - (l + m) * base) / (l - m + 1);
                base = nextBase;
                nextBase = nextPolynomial;
            }
            return nextPolynomial;
        }
    }
};

export function getSphericalHarmonic(l, m) {
    return (phi) => {
        var sign = m % 2 == 0 ? 1 : -1;
        var normalization = complex(sqrt((getFactorial(l - m) * (2 * l + 1)) / (getFactorial(l + m) * 4 * Math.PI)), 0);
        return multiply(sign, normalization, exp(complex(0, m * phi)));
    };
};

function getFunctional(n, l, m) {
    return (x, y, z) => {
        var sphericals = mapToSpherical(x, y, z);
        var rho = sphericals[0];
        var theta = sphericals[1];
        var phi = sphericals[2];
        
        return multiply(getLaguerrePolynomial(n, l)(rho), getLegendrePolynomial(l, m)(cos(theta)), getSphericalHarmonic(l, m)(phi));
    };
}

function getGradient(n, l, m, timer) {

    return (x, y, z) => {
        var delta = 0.00000001;

        var sphericals = mapToSpherical(x, y, z);
        var rho = sphericals[0];
        var theta = sphericals[1];
        var phi = sphericals[2];

        var frho = getLaguerrePolynomial(n, l)(rho + delta / 2);
        var ftheta = getLegendrePolynomial(l, m)(cos(theta) + delta / 2);
        var fphi = getSphericalHarmonic(l, m)(phi + delta / 2);

        var deltaRho = divide(subtract(frho, getLaguerrePolynomial(n, l)(rho - delta / 2)), (delta));
        var deltaTheta = divide(subtract(ftheta, getLegendrePolynomial(l, m)(cos(theta) - delta / 2)), (delta * rho));
        var deltaPhi = divide(subtract(fphi, getSphericalHarmonic(l, m)(phi - delta / 2)), (delta * rho * Math.sin(theta)));

        deltaRho = multiply(deltaRho, ftheta, fphi);
        deltaTheta = multiply(deltaTheta, frho, fphi);
        deltaPhi = multiply(deltaPhi, frho, ftheta);

        var unitRho = [sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta)];
        var unitTheta = [cos(theta) * cos(phi), cos(theta) * sin(phi), sin(theta) * -1];
        var unitPhi = [sin(phi), cos(phi)*-1, 0.0];

        return [
            add(multiply(unitRho[0], deltaRho), multiply(unitTheta[0], deltaTheta), multiply(unitPhi[0], deltaPhi)),
            add(multiply(unitRho[1], deltaRho), multiply(unitTheta[1], deltaTheta), multiply(unitPhi[1], deltaPhi)),
            add(multiply(unitRho[2], deltaRho), multiply(unitTheta[2], deltaTheta), multiply(unitPhi[2], deltaPhi)),
        ];
    }
}

function getEnergyLevel(n) {
    return 5 / (n * n);
}


class Particle {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = WHITE;
        this.buffer = [];
    }

    move(dx, dy, dz, addToPlayback) {
        if (addToPlayback) {
            this.buffer.push({x: this.x, y: this.y, z: this.z, color: themeTransientCycle(WHITE, WHITE, (1 + Math.sin(Math.atan(this.y / this.x) / 2)) / 2, interpolateTrig)});
        }
        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    playback(history) {
        this.set(this.buffer[history].x, this.buffer[history].y, this.buffer[history].z);
        this.setColor(this.buffer[history].color);
    }

    set(dx, dy, dz) {
        this.x = dx;
        this.y = dy;
        this.z = dz;
    }

    setColor(color) {
        this.color = color;
    }
}


const Atom = class {
    constructor (props) {
        this.superposition = props.superposition;
        this.particleCount = props.particleCount;
        this.boxSize = props.boxSize;
        this.timer = 0;
        this.playbackTimer = -1000;

        this.particles = [];
        
        while (this.particles.length < props.particleCount) {
            var theta = randRange(0, Math.PI * 2);
            var phi = asin(randRange(-1, 1));
            var radius = 1 / randRange(0.5, 2);
            var newParticle = new Particle(
                radius * cos(theta) * cos(phi),
                radius * cos(theta) * sin(phi),
                radius * sin(theta),
            );
            if (coinFlip(100000 * this.getProbabilityDistribution(newParticle.x, newParticle.y, newParticle.z, 0))) {
                this.particles.push(newParticle);
            }
        }
    }

    getWavefunction(x, y, z, t) {
        var total = 0;
        for (var i = 0; i < this.superposition.length; i++) {
            var phase = exp(complex(0, getEnergyLevel(this.superposition[i].n) * t));
            total = add(total, multiply(phase, this.superposition[i].weight, getFunctional(this.superposition[i].n, this.superposition[i].l, this.superposition[i].m)(x, y, z)));
        }

        return total;
    }

    getProbabilityDistribution(x, y, z, t) {
        var wavefunction = this.getWavefunction(x, y, z, t);
        var wavefunctionC = wavefunction.conjugate();
        return multiply(wavefunction, wavefunctionC);    
    }

    getWavefunctionGradient(x, y, z, t) {
        var total = [complex(0, 0), complex(0, 0), complex(0, 0)];
        for (var i = 0; i < this.superposition.length; i++) {
            var phase = exp(complex(0, getEnergyLevel(this.superposition[i].n) * t));
            var grad = getGradient(this.superposition[i].n, this.superposition[i].l, this.superposition[i].m, this.timer)(x, y, z, t);
            total[0] = add(total[0], multiply(phase, this.superposition[i].weight, grad[0]));
            total[1] = add(total[1], multiply(phase, this.superposition[i].weight, grad[1]));
            total[2] = add(total[2], multiply(phase, this.superposition[i].weight, grad[2]));
        }
        return total;
    }
    
    getVelocity(x, y, z, t) {
        var wavefunction = this.getWavefunction(x, y, z, t);
        var wavefunctionC = wavefunction.conjugate();
        var gradient = this.getWavefunctionGradient(x, y, z, t);
        var gradientC = [
            gradient[0].conjugate(), 
            gradient[1].conjugate(), 
            gradient[2].conjugate(), 
        ];
        var velocity = [
            divide(subtract(multiply(wavefunctionC, gradient[0]), multiply(wavefunction, gradientC[0])), add(1e-8, multiply(wavefunction, wavefunctionC))),
            divide(subtract(multiply(wavefunctionC, gradient[1]), multiply(wavefunction, gradientC[1])), add(1e-8, multiply(wavefunction, wavefunctionC))),
            divide(subtract(multiply(wavefunctionC, gradient[2]), multiply(wavefunction, gradientC[2])), add(1e-8, multiply(wavefunction, wavefunctionC)))
        ];
        return velocity;
    }

    update(increment) {
        var deltat = 0.0075;
        if (this.playbackTimer < 0) {
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                var oldNorm = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
                for (var j = 0; j < 1; j++) {
                    var velocity = this.getVelocity(p.x, p.y, p.z, this.timer);
                    var t = 1 - sin(atan(velocity[1].im / velocity[0].im) / 2) / 2;
                    p.setColor(themeTransientCycle(WHITE, WHITE, t, interpolateTrig));
                    p.move(velocity[0].im * deltat, velocity[1].im * deltat, velocity[2].im * deltat, false);
                }
                var newNorm = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
                var factor = ((oldNorm - newNorm) / newNorm) * 0.05;
                p.move(p.x * factor, p.y * factor, p.z * factor, true);
            }
            console.log(this.playbackTimer);
        } else {
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                p.setColor(p.buffer[this.playbackTimer].color);
                p.playback(this.playbackTimer);
            }
        }
        this.playbackTimer += 1;
        if (this.playbackTimer == 1000) {
            this.playbackTimer = 0;
        }
        this.timer += deltat * 5;
        return this;
    }
}

export default Atom;