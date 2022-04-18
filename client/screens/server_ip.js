
export const verify = (popup_set_state, server_ip, server_port) => {
    let ip = server_ip;
    let port = server_port;
    fetch('http://'+ip+':'+port+'/welcome')
    .then(
        (res)=>{
            popup_set_state(false);
        }
    ).catch(
        (err)=>{
            
            popup_set_state(true);
        }
    )
}