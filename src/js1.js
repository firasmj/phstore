function openDetails()
{
    document.getElementsByClassName("detailspopup")[0].style.display="block";
}

function closeDetails()
{
    document.getElementsByClassName("detailspopup")[0].style.display="none";
}

function price1()
{
    var price=document.getElementsByClassName("inumber")[0].value;
    var fprice=price*(1.1);
    var fprice=fprice.toFixed(2);
    document.getElementsByClassName("iprice")[0].value=fprice+"$";
    
}