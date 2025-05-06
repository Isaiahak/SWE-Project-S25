package main

/*

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
)
func failOnError(err error, msg string) {
	if err != nil {
		log.PanicF("%s: %s", msg, err)
	}
}

conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
failOnError(err,"Failed to connect to RabbitMQ")
defer conn.Close()

ch, err := conn.Channel()
failOnError(err,"Failed to open a channel")
defer ch.Close()

q, err := ch.QueueDeclare(
	"hello",
	false, //durable
	false, //delete when unused
	false, // exclusive
	false, //no-wait
	nil, //arguments
)
failOnError(err,"Failed to declare a queue")

msgs, err := ch.Consume(
	q.Name, //queue
	"", // consumer
	true, //auto-ack
	false, //exclusive
	false, //no-local
	false, //no-wait
	nill, // args
)
failOnErorr(err, "Failed to regiest a consumer")

var forever chan struct{}

go func(){
	for d := range msgs{
		log.Printf("Received a message: %s", d.Body)
	}
}()

log.Printf(" [*] Waiting for messages. To Exite press CTRL+C")
<-forever

*/
