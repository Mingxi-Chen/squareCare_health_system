/**Time widget of Dashboard Page */
function TimeWidget() {
    const Timer = ()=>{
            const d = new Date();
            if(document.getElementById("DS-Time")&&document.getElementById("DS-Date")){
                document.getElementById("DS-Time").innerHTML = d.toLocaleTimeString();
                document.getElementById("DS-Date").innerHTML = d.toDateString();
            }
        
    }
    /**refresh every one second */
    setInterval(Timer, 1000);

    return (
        <>
            <div className="DS-Time-Container">
                <h1 id="DS-Date" className="Date-font"></h1>
                <h1 id="DS-Time"></h1>
            </div>
        </>
    )
}
export default TimeWidget;
