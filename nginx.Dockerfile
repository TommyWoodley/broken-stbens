FROM nginx
ARG certificate
ARG private_key

# Copy configuration
COPY ./nginx/prod.conf /etc/nginx/conf.d/scientia.doc.ic.ac.uk.conf
RUN mkdir /etc/nginx/certs
RUN echo $certificate | sed 's/ CERTIFICATE/xCERTIFICATE/g;s/ /\n/g;s/xCERTIFICATE/ CERTIFICATE/g' > /etc/nginx/certs/fullchain.pem
RUN echo $private_key | sed 's/ PRIVATE KEY/xPRIVATExKEY/g;s/ /\n/g;s/xPRIVATExKEY/ PRIVATE KEY/g' > /etc/nginx/certs/privkey.key

