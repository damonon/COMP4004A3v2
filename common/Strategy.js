class Strategy{
    contructor(hand){
        if(new.target === Strategy){
            throw new Error(" Can't Instantiate abstract class")
        }
    }
}

module.exports = Strategy;