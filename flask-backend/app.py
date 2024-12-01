from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pymysql
from datetime import datetime

# Use pymysql to avoid MySQLdb issues
pymysql.install_as_MySQLdb()

app = Flask(__name__)
CORS(app)

# MySQL database connection configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/complaints_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Complaint Model
class Complaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Complaint {self.title}>"

# Comment Model
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign key to Complaint
    complaint_id = db.Column(db.Integer, db.ForeignKey('complaint.id'), nullable=False)
    
    # Relationship to Complaint
    complaint = db.relationship('Complaint', backref=db.backref('comments', lazy=True))

    def __repr__(self):
        return f"<Comment {self.text[:20]}>"

# Complaint Routes
@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    author = data.get('author')

    if not title or not description or not author:
        return jsonify({"error": "All fields (title, description, author) are required."}), 400

    complaint = Complaint(title=title, description=description, author=author)
    db.session.add(complaint)
    db.session.commit()

    return jsonify({"message": "Complaint created successfully", "complaint": complaint.id}), 201

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    complaints = Complaint.query.all()
    return jsonify([{"id": complaint.id, "title": complaint.title, "description": complaint.description, "author": complaint.author} for complaint in complaints])

@app.route('/api/complaints/<int:id>', methods=['GET'])
def get_complaint(id):
    complaint = Complaint.query.get(id)
    if complaint is None:
        return jsonify({"error": "Complaint not found"}), 404
    return jsonify({"id": complaint.id, "title": complaint.title, "description": complaint.description, "author": complaint.author})

@app.route('/api/complaints/<int:id>', methods=['PUT'])
def update_complaint(id):
    complaint = Complaint.query.get(id)
    if complaint is None:
        return jsonify({"error": "Complaint not found"}), 404

    data = request.get_json()
    complaint.title = data.get('title', complaint.title)
    complaint.description = data.get('description', complaint.description)
    complaint.author = data.get('author', complaint.author)

    db.session.commit()

    return jsonify({"message": "Complaint updated successfully", "complaint": {"id": complaint.id, "title": complaint.title, "description": complaint.description, "author": complaint.author}})

@app.route('/api/complaints/<int:id>', methods=['DELETE'])
def delete_complaint(id):
    complaint = Complaint.query.get(id)
    if complaint is None:
        print(f"Complaint with id {id} not found.")
        return jsonify({"error": "Complaint not found"}), 404

    print(f"Deleting complaint with id {id}.")
    db.session.delete(complaint)
    db.session.commit()

    return jsonify({"message": "Complaint deleted successfully"})

# Comment Routes

@app.route('/api/complaints/<int:complaint_id>/comments', methods=['GET'])
def get_comments(complaint_id):
    complaint = Complaint.query.get(complaint_id)
    if not complaint:
        return jsonify({'error': 'Complaint not found'}), 404

    comments = Comment.query.filter_by(complaint_id=complaint.id).all()

    comments_list = [{
        'id': comment.id,
        'text': comment.text,
        'created_at': comment.created_at
    } for comment in comments]

    return jsonify(comments_list)

@app.route('/api/complaints/<int:complaint_id>/comments', methods=['POST'])
def create_comment(complaint_id):
    complaint = Complaint.query.get(complaint_id)
    if not complaint:
        return jsonify({'message': 'Complaint not found'}), 404

    data = request.get_json()
    print(data)  # Add a print statement to inspect the incoming data
    
    text = data.get('text')
    if not text:
        return jsonify({'message': 'Comment text is required'}), 400

    new_comment = Comment(text=text, complaint_id=complaint_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"id": new_comment.id, "text": new_comment.text, "created_at": new_comment.created_at}), 201


@app.route('/api/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    # Find the comment by its id
    comment = Comment.query.get(id)
    
    if not comment:
        # If the comment does not exist, return an error
        return jsonify({'message': 'Comment not found'}), 404

    # Log the comment that will be deleted
    print(f"Deleting comment with id {id}: {comment.text}")

    # Delete the comment
    db.session.delete(comment)
    db.session.commit()

    # Return a success message
    return jsonify({'message': 'Comment deleted successfully'}), 200
 
@app.route('/api/comments/<int:id>', methods=['PUT'])
def edit_comment(id):
    print(f"Looking for comment with ID: {id}")  # Debugging print
    comment = Comment.query.get(id)
    if not comment:
        print(f"Comment with ID {id} not found.")
        return jsonify({'message': 'Comment not found'}), 404

    data = request.get_json()
    new_text = data.get('text')
    if new_text:
        comment.text = new_text
        db.session.commit()
        return jsonify({"id": comment.id, "text": comment.text, "created_at": comment.created_at}), 200
    else:
        return jsonify({'message': 'text is required to edit the comment'}), 400


if __name__ == "__main__":
    app.run(debug=True)
