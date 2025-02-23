function logData(user, response, html, route){
    const data={
        user:user,
        response:response,
        html:html,
        route:route,
        date:new Date().toLocaleString('en-US', { timeZone: 'America/Toronto', hour12: false })
    }
    fetch('http://ec2-3-96-133-132.ca-central-1.compute.amazonaws.com/handle_chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert the data to a JSON string
    })
    console.log('logged data')
}

module.exports = {logData};